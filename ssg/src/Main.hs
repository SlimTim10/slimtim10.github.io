{-# LANGUAGE OverloadedStrings #-}

import Control.Monad (forM_)
import Data.Maybe (fromMaybe)
import Hakyll
import qualified Data.Text as T
import qualified Data.Text.Slugger as Slugger
import Text.Pandoc
  ( Extension (Ext_fenced_code_attributes, Ext_footnotes, Ext_gfm_auto_identifiers, Ext_implicit_header_references, Ext_smart),
    Extensions,
    ReaderOptions,
    WriterOptions (writerHighlightStyle),
    extensionsFromList,
    githubMarkdownExtensions,
    readerExtensions,
    writerExtensions,
  )
import Text.Pandoc.Highlighting (Style, breezeDark, styleToCss)

--------------------------------------------------------------------------------
-- CONFIG

root :: String
root = "https://timjohns.ca"

siteName :: String
siteName = "Tim Johns"

config :: Configuration
config =
  defaultConfiguration
    { destinationDirectory = "dist"
    -- , ignoreFile = const False
    , previewHost = "127.0.0.1"
    , previewPort = 8000
    , providerDirectory = "src"
    , storeDirectory = "ssg/_cache"
    , tmpDirectory = "ssg/_tmp"
    }

--------------------------------------------------------------------------------
-- BUILD

main :: IO ()
main = hakyllWith config $ do
  forM_
    [ "CNAME"
    , "favicon.ico"
    , "robots.txt"
    , "_config.yml"
    , "images/*"
    , "js/*"
    , "fonts/*"
    ]
    $ \f -> match f $ do
      route idRoute
      compile copyFileCompiler

  match "css/*" $ do
    route idRoute
    compile compressCssCompiler

  match "posts/*" $ do
    let ctx = constField "type" "article" <> postCtx

    route $ metadataRoute titleRoute
    compile $
      pandocCompilerCustom
        >>= loadAndApplyTemplate "templates/post.html" ctx
        >>= saveSnapshot "content"
        >>= loadAndApplyTemplate "templates/default.html" (ctx <> constField "stylesheet" "post")

  match "index.html" $ do
    route idRoute
    compile $ do
      posts <- recentFirst =<< loadAll "posts/*"

      let indexCtx =
            boolField "page-home" (const True)
            <> listField "posts" postCtx (return . take 3 $ posts)
            <> pageCtx

      getResourceBody
        >>= applyAsTemplate indexCtx
        >>= loadAndApplyTemplate "templates/default.html" indexCtx

  match "writing.html" $ do
    route idRoute
    compile $ do
      posts <- recentFirst =<< loadAll "posts/*"

      let writingCtx =
            boolField "page-writing" (const True)
            <> listField "posts" postCtx (return posts)
            <> pageCtx

      getResourceBody
        >>= applyAsTemplate writingCtx
        >>= loadAndApplyTemplate "templates/default.html" writingCtx

  mapM_ simplePage
    [ ("about.html", "about")
    , ("learn.html", "learn")
    , ("projects.html", "projects")
    , ("contact.html", "contact")
    ]

  match "templates/*" $
    compile templateBodyCompiler

  create ["sitemap.xml"] $ do
    route idRoute
    compile $ do
      posts <- recentFirst =<< loadAll "posts/*"

      let pages = posts
          sitemapCtx =
            constField "root" root
              <> constField "siteName" siteName
              <> listField "pages" postCtx (return pages)

      makeItem ("" :: String)
        >>= loadAndApplyTemplate "templates/sitemap.xml" sitemapCtx

  create ["rss.xml"] $ do
    route idRoute
    compile (feedCompiler renderRss)

  create ["atom.xml"] $ do
    route idRoute
    compile (feedCompiler renderAtom)

  create ["css/code.css"] $ do
    route idRoute
    compile (makeStyle pandocHighlightStyle)

  where
    simplePage (pattern, name) = do
      match pattern $ do
        -- e.g., "page-about"
        let nameField = boolField ("page-" ++ name) (const True)
        let ctx = nameField <> pageCtx
        route idRoute
        compile $ do
          getResourceBody
            >>= applyAsTemplate ctx
            >>= loadAndApplyTemplate "templates/default.html" ctx


--------------------------------------------------------------------------------
-- COMPILER HELPERS

makeStyle :: Style -> Compiler (Item String)
makeStyle =
  makeItem . compressCss . styleToCss

--------------------------------------------------------------------------------
-- CONTEXT

feedCtx :: Context String
feedCtx =
  titleCtx
  <> postCtx
  <> bodyField "description"

pageCtx :: Context String
pageCtx =
  constField "root" root
  <> constField "siteName" siteName
  <> defaultContext

postCtx :: Context String
postCtx =
  pageCtx
  <> boolField "page-writing" (const True)
  <> dateField "date" "%b %_d, %Y"
  <> defaultContext

titleCtx :: Context String
titleCtx =
  field "title" updatedTitle

--------------------------------------------------------------------------------
-- TITLE HELPERS

replaceAmp :: String -> String
replaceAmp =
  replaceAll "&" (const "&amp;")

replaceTitleAmp :: Metadata -> String
replaceTitleAmp =
  replaceAmp . safeTitle

safeTitle :: Metadata -> String
safeTitle =
  fromMaybe "no title" . lookupString "title"

updatedTitle :: Item a -> Compiler String
updatedTitle =
  fmap replaceTitleAmp . getMetadata . itemIdentifier

--------------------------------------------------------------------------------
-- PANDOC

pandocCompilerCustom :: Compiler (Item String)
pandocCompilerCustom =
  pandocCompilerWith pandocReaderOpts pandocWriterOpts

pandocExtensionsCustom :: Extensions
pandocExtensionsCustom =
  githubMarkdownExtensions
    <> extensionsFromList
      [ Ext_fenced_code_attributes
      , Ext_gfm_auto_identifiers
      , Ext_implicit_header_references
      , Ext_smart
      , Ext_footnotes
      ]

pandocReaderOpts :: ReaderOptions
pandocReaderOpts =
  defaultHakyllReaderOptions
    { readerExtensions = pandocExtensionsCustom
    }

pandocWriterOpts :: WriterOptions
pandocWriterOpts =
  defaultHakyllWriterOptions
    { writerExtensions = pandocExtensionsCustom
    , writerHighlightStyle = Just pandocHighlightStyle
    }

pandocHighlightStyle :: Style
pandocHighlightStyle =
  breezeDark -- https://hackage.haskell.org/package/pandoc/docs/Text-Pandoc-Highlighting.html

-- FEEDS

type FeedRenderer =
  FeedConfiguration ->
  Context String ->
  [Item String] ->
  Compiler (Item String)

feedCompiler :: FeedRenderer -> Compiler (Item String)
feedCompiler renderer =
  renderer feedConfiguration feedCtx
    =<< recentFirst
    =<< loadAllSnapshots "posts/*" "content"

feedConfiguration :: FeedConfiguration
feedConfiguration =
  FeedConfiguration
    { feedTitle = "Tim Johns"
    , feedDescription = "Writing"
    , feedAuthorName = "Tim Johns"
    , feedAuthorEmail = "johns.timf@gmail.com"
    , feedRoot = root
    }

--------------------------------------------------------------------------------
-- CUSTOM ROUTE

getTitleFromMeta :: Metadata -> String
getTitleFromMeta =
  fromMaybe "no title" . lookupString "title"

fileNameFromTitle :: Metadata -> FilePath
fileNameFromTitle =
  T.unpack . (`T.append` ".html") . Slugger.toSlug . T.pack . getTitleFromMeta

titleRoute :: Metadata -> Routes
titleRoute =
  constRoute . fileNameFromTitle
