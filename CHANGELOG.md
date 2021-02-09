# [1.7.0](https://github.com/projectcaluma/ember-alexandria/compare/v1.6.0...v1.7.0) (2021-02-09)


### Bug Fixes

* **search:** add preventDefault to submit ([042d24d](https://github.com/projectcaluma/ember-alexandria/commit/042d24db3659f81421b964e820f0658709a4b3fb))


### Features

* **config:** add resolver for user and group IDs ([7364345](https://github.com/projectcaluma/ember-alexandria/commit/73643450af911987ff7b7f8738951bdae351c8ba))

# [1.6.0](https://github.com/projectcaluma/ember-alexandria/compare/v1.5.0...v1.6.0) (2021-02-08)


### Bug Fixes

* **deps:** add resolution for UIkit and @babel/parser ([110ec08](https://github.com/projectcaluma/ember-alexandria/commit/110ec08b12e018af955d77b6a77f508211b0df8d))
* **route:** add queryParams config to route ([93fe019](https://github.com/projectcaluma/ember-alexandria/commit/93fe0191a84fcfb8b1221104028146a7fdd23408))
* **routes:** add empty model hook and param options to route ([e869997](https://github.com/projectcaluma/ember-alexandria/commit/e869997d3db7251897f21165b7c9d2615137ec38))


### Features

* **deps:** switch from Uglify to Terser for code mangling ([d8ab74c](https://github.com/projectcaluma/ember-alexandria/commit/d8ab74cbfb082ffa01346d208eedb8a8a8ce0c9f))
* **document-details:** update UI for description and its form ([c2ef2a5](https://github.com/projectcaluma/ember-alexandria/commit/c2ef2a53a00e3bc0733c1d54ab0603e1f873fdd4))

# [1.5.0](https://github.com/projectcaluma/ember-alexandria/compare/v1.4.0...v1.5.0) (2021-01-15)


### Bug Fixes

* reenable the ember-release test ([c317f64](https://github.com/projectcaluma/ember-alexandria/commit/c317f64c3f1d067e1fcd0e3ffc84e2ae42e839fa))


### Features

* **document-details:** add form to edit the document's description ([55f0973](https://github.com/projectcaluma/ember-alexandria/commit/55f09739738773e1cd3a238532af50fee6303413))

# [1.4.0](https://github.com/projectcaluma/ember-alexandria/compare/v1.3.1...v1.4.0) (2021-01-13)


### Bug Fixes

* temporarily disable the ember-release test ([667836f](https://github.com/projectcaluma/ember-alexandria/commit/667836f3f2a16c36d4b2cc443869daa9288723bf))


### Features

* **document-grid:** show a warning when files cannot be dropped ([2dd1ecb](https://github.com/projectcaluma/ember-alexandria/commit/2dd1ecbb93b369d9bd402767489fdb1e64d2264c))
* **tags:** filter tags by meta value ([2bdcb69](https://github.com/projectcaluma/ember-alexandria/commit/2bdcb69caa317789a33726cc8d755061d67e5f1f))
* introduce created-by to documents, files, and tags ([75cd7d0](https://github.com/projectcaluma/ember-alexandria/commit/75cd7d0a044c0fe8c31d969ab367a80aa8214551))

## [1.3.1](https://github.com/projectcaluma/ember-alexandria/compare/v1.3.0...v1.3.1) (2020-12-03)


### Bug Fixes

* **document-grid:** rename lastSuccessful alias ([d62ecce](https://github.com/projectcaluma/ember-alexandria/commit/d62eccecc659943910e55c27b6c1dbbb83788bef))
* **document-upload-button:** update multiple attribute ([eb9f193](https://github.com/projectcaluma/ember-alexandria/commit/eb9f19387f3a38450bed8f4404eaad39c6775d2c))

# [1.3.0](https://github.com/projectcaluma/ember-alexandria/compare/v1.2.1...v1.3.0) (2020-12-02)


### Bug Fixes

* **document-grid:** use node counter instead of pointer-events ([d553f2c](https://github.com/projectcaluma/ember-alexandria/commit/d553f2c60f1edf5d2eccd378505473bd86147e48))
* **tag-filter:** change javascript: link to button ([f2eca4e](https://github.com/projectcaluma/ember-alexandria/commit/f2eca4efc960b5dd382510ef1e13361823bc105e))


### Features

* **document-grid:** add drag'n'drop capability to document grid ([dd8bc22](https://github.com/projectcaluma/ember-alexandria/commit/dd8bc22c88423cc6097d8ff7f90e6bf1f60fd705))
* **models:** change tag name to non-localized ([b5abb58](https://github.com/projectcaluma/ember-alexandria/commit/b5abb587f5c2742233a03ad00b9fa131df907034))
* **services:** add document service for upload and replace ([a1d0a2f](https://github.com/projectcaluma/ember-alexandria/commit/a1d0a2fda27a397d308e98280adf5cba96d10bdb))

## [1.2.1](https://github.com/projectcaluma/ember-alexandria/compare/v1.2.0...v1.2.1) (2020-11-26)


### Bug Fixes

* **app:** export tag serializer to and remove hard-coded value ([0847fad](https://github.com/projectcaluma/ember-alexandria/commit/0847fadfc3547962e9dc03c91458a07b652a5928))

# [1.2.0](https://github.com/projectcaluma/ember-alexandria/compare/v1.1.0...v1.2.0) (2020-11-24)


### Bug Fixes

* **deps:** pin ember-uikit to 2.2.0 to fix floating test issue with modal and rootElement ([cbbd7d9](https://github.com/projectcaluma/ember-alexandria/commit/cbbd7d95e40c5a0df8ba580cdc5d89361d6cf72d))
* **document-detail:** add task import to component ([be2549a](https://github.com/projectcaluma/ember-alexandria/commit/be2549ad4b10bcf742790856ab1b39934dc54481))
* **document-details:** reset matching tags and minor fixes ([b6b6575](https://github.com/projectcaluma/ember-alexandria/commit/b6b6575af7146c6d7b07142cd32d13b0c9b49341))
* **dummy:** remove smiley from alexandria dummy app ([4fe177c](https://github.com/projectcaluma/ember-alexandria/commit/4fe177c0903a74b597800ad2a963295b8f7bad8b))
* **dummy:** update language to English to conform to backend ([0f64b6f](https://github.com/projectcaluma/ember-alexandria/commit/0f64b6fb4806fd122704e04ae7e11c1ccb1587a8))
* **models:** change some attributes to localized ([004e2a1](https://github.com/projectcaluma/ember-alexandria/commit/004e2a128304776b9fd163f21a4f44b7575cd075))
* **serializers:** add file serializer for more control ([09bcb3e](https://github.com/projectcaluma/ember-alexandria/commit/09bcb3e80449aee3fa993ee4dad956643efec568))
* **tags-filter:** use badge for tags ([85ab804](https://github.com/projectcaluma/ember-alexandria/commit/85ab804d919288b4181a3c7131635921afc86254))


### Features

* **document-delete-buttom:** add a prompt to the delete buttons ([fe2bca9](https://github.com/projectcaluma/ember-alexandria/commit/fe2bca9c95c388c35205e172f6bacf743d520db5))
* **document-details:** add label to document title and fix design ([1d75307](https://github.com/projectcaluma/ember-alexandria/commit/1d75307a01eaed1633d072696fc1524460d1ea24))
* **tags:** add tag crud to side panel ([1fcc290](https://github.com/projectcaluma/ember-alexandria/commit/1fcc290107183651bd29dd12b9f0e2e8e1025daf))

# [1.1.0](https://github.com/projectcaluma/ember-alexandria/compare/v1.0.0...v1.1.0) (2020-11-06)


### Features

* **history:** add history of files to the side-panel ([c718504](https://github.com/projectcaluma/ember-alexandria/commit/c71850482af103058708eea9fcbb7a4177c29804))

# 1.0.0 (2020-10-07)


### Bug Fixes

* **config&docs:** replace emeisQueryParams with alexandriaQueryParams ([bc58d9b](https://github.com/projectcaluma/ember-alexandria/commit/bc58d9bd8ee621df6319988ec3a4e08b7af0127e))
* **css-grid:** fix empty icon in grid and positioning ([f3344ec](https://github.com/projectcaluma/ember-alexandria/commit/f3344ecbcb5865f158743e7d44293c65aaecb285))
* **filters:** prefix filters for api with `filters` ([521a279](https://github.com/projectcaluma/ember-alexandria/commit/521a279122e27a78a6ddac27aef604dfb5910bcd))
* **grid:** replace usage of uk-grid with css grid since uk-grid was buggy ([e31b191](https://github.com/projectcaluma/ember-alexandria/commit/e31b191fd1b3a4465641760f670d21ccc8b2494e))
* **set-style:** pass style through htmlSafe ([3a0d74f](https://github.com/projectcaluma/ember-alexandria/commit/3a0d74fc14294c9f3ab6598885863449d6f10d52))
* start-proxy command ([4160b02](https://github.com/projectcaluma/ember-alexandria/commit/4160b02aac3739a4ac2517630c6c4ebd464dfefd))


### Features

* add errorhandling and skeleton loading ([d02876e](https://github.com/projectcaluma/ember-alexandria/commit/d02876edae2c5426ed36630429675177b2b50031))
* add errorhandling and skeleton loading ([d0c8252](https://github.com/projectcaluma/ember-alexandria/commit/d0c8252d31ec5193382a65bdd0296160a5067d83))
* **category-nav:** add a all-files button ([3b861f2](https://github.com/projectcaluma/ember-alexandria/commit/3b861f2e924cba3330d6b5e51b02823d54f84f02))
* **file-details:** add document detail view for editing title and meta data ([3e92821](https://github.com/projectcaluma/ember-alexandria/commit/3e92821542d106b0b6a48cf146bf666226f68a71))
* **localization:** add ember-localized-model ([b7197c6](https://github.com/projectcaluma/ember-alexandria/commit/b7197c6b2d1965853eca5d57b2fa42b3566d52a3))
* **meta-filter:** add meta filter config ([8f9a864](https://github.com/projectcaluma/ember-alexandria/commit/8f9a864ddba213ec1aca64a5fba788131c45b6d5))
* **nav:** add basic category nav and tagging ([5a29cf4](https://github.com/projectcaluma/ember-alexandria/commit/5a29cf4952ff88c20a863dc1ca7f57fcf2de7759))
* **search:** add basic search to document view ([26c0de2](https://github.com/projectcaluma/ember-alexandria/commit/26c0de2c6c3dc8c9028dc41e8ef11bf5b6c95613))
* add "start-proxy" command ([862b377](https://github.com/projectcaluma/ember-alexandria/commit/862b377f74fb814a6227f23a77469bc4c1819017))
