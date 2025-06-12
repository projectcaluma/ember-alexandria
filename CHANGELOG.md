## [10.5.1](https://github.com/projectcaluma/ember-alexandria/compare/v10.5.0...v10.5.1) (2025-05-05)


### Bug Fixes

* **upload:** only show success notification on successful upload ([3761c55](https://github.com/projectcaluma/ember-alexandria/commit/3761c555d6b6780d5f08b4565284781036d12f4f))

# [10.5.0](https://github.com/projectcaluma/ember-alexandria/compare/v10.4.1...v10.5.0) (2025-05-02)


### Bug Fixes

* **upload:** make sure no more than three files are uploaded in parallel ([235c6aa](https://github.com/projectcaluma/ember-alexandria/commit/235c6aa266ecda850b671b21ec58d1bcaeafb9e9))


### Features

* **document-details:** show original filename ([9245fac](https://github.com/projectcaluma/ember-alexandria/commit/9245fac1553edf868176e084801177710f4d1fe7))

## [10.4.1](https://github.com/projectcaluma/ember-alexandria/compare/v10.4.0...v10.4.1) (2025-03-26)


### Bug Fixes

* **upload:** check mime type with name fallback ([#1136](https://github.com/projectcaluma/ember-alexandria/issues/1136)) ([b509465](https://github.com/projectcaluma/ember-alexandria/commit/b509465fd1c31c8d5215d0b127c9f3537a3f60f8))

# [10.4.0](https://github.com/projectcaluma/ember-alexandria/compare/v10.3.3...v10.4.0) (2025-02-20)


### Bug Fixes

* **upload:** add missing router transition after upload drop on category nav ([d4f4b30](https://github.com/projectcaluma/ember-alexandria/commit/d4f4b303c84ed2deb30160a7f3a9bb8df0149f81))
* **upload:** pass document default meta from config ([ae3a8f3](https://github.com/projectcaluma/ember-alexandria/commit/ae3a8f32ac2388a583d683c811aae55c7a2c4c4c))


### Features

* **document:** add copy button ([3cdfb5d](https://github.com/projectcaluma/ember-alexandria/commit/3cdfb5dbbfd892f8cd8d5647e134d6689cbb3636))
* **upload:** add optional parameters to the upload function ([c69f162](https://github.com/projectcaluma/ember-alexandria/commit/c69f1622723037920a7d61ebef0a6041e3ffbf24))

## [10.3.3](https://github.com/projectcaluma/ember-alexandria/compare/v10.3.2...v10.3.3) (2025-02-14)


### Bug Fixes

* **deps:** allow previous versions of ember-load-initializers and ember-resolver ([14807ee](https://github.com/projectcaluma/ember-alexandria/commit/14807ee5e1ad01d21890907dd212d114a2dd09fb))

## [10.3.2](https://github.com/projectcaluma/ember-alexandria/compare/v10.3.1...v10.3.2) (2025-02-14)


### Bug Fixes

* **adapter:** add missing namespace configuration ([8e56d91](https://github.com/projectcaluma/ember-alexandria/commit/8e56d91e5b3aad0c794172aeb9a9a9f1a1a7e948))

## [10.3.1](https://github.com/projectcaluma/ember-alexandria/compare/v10.3.0...v10.3.1) (2025-02-12)


### Bug Fixes

* **documents:** add mimeType lookup for mimeType/file-extension check ([4e6d533](https://github.com/projectcaluma/ember-alexandria/commit/4e6d533175e1501d7a0e89f5efe62d5fa0d03db6))

# [10.3.0](https://github.com/projectcaluma/ember-alexandria/compare/v10.2.2...v10.3.0) (2025-02-12)


### Bug Fixes

* update packages ([#1069](https://github.com/projectcaluma/ember-alexandria/issues/1069)) ([57c4c78](https://github.com/projectcaluma/ember-alexandria/commit/57c4c782b4ad5e2fbcb2343041414fcfe2722f92))
* **upload:** user correct category filter key ([e46dfea](https://github.com/projectcaluma/ember-alexandria/commit/e46dfea599954a11f4dacb27942df1c9d5ebf8a5))


### Features

* **document-details:** show general file type with matching icon ([ca4247d](https://github.com/projectcaluma/ember-alexandria/commit/ca4247d8d8a2d586cf7275b6211ff5811309f215))

## [10.2.2](https://github.com/projectcaluma/ember-alexandria/compare/v10.2.1...v10.2.2) (2025-01-29)


### Bug Fixes

* **search:** fix metainfo filter to differentiate search ([a26dfe8](https://github.com/projectcaluma/ember-alexandria/commit/a26dfe89f180340c198ccb74359364c41aefa0a4))

## [10.2.1](https://github.com/projectcaluma/ember-alexandria/compare/v10.2.0...v10.2.1) (2025-01-29)


### Bug Fixes

* **search:** use correct filter on document list ([c625962](https://github.com/projectcaluma/ember-alexandria/commit/c62596271f8a042597bda9a8bc34e8a47a9399a5))

# [10.2.0](https://github.com/projectcaluma/ember-alexandria/compare/v10.1.0...v10.2.0) (2025-01-27)


### Features

* **search:** add clear button ([1d407fe](https://github.com/projectcaluma/ember-alexandria/commit/1d407fe1f2adc94d4fa557799d0894f33cfbdf79))

# [10.1.0](https://github.com/projectcaluma/ember-alexandria/compare/v10.0.4...v10.1.0) (2024-11-29)


### Bug Fixes

* **document-card:** selected color ([#1026](https://github.com/projectcaluma/ember-alexandria/issues/1026)) ([d8b1039](https://github.com/projectcaluma/ember-alexandria/commit/d8b103969b79e9ef7859db2bfb7b6dd11d9896b5))


### Features

* emulate production left space of hosted app ([#1013](https://github.com/projectcaluma/ember-alexandria/issues/1013)) ([417f891](https://github.com/projectcaluma/ember-alexandria/commit/417f89189b5f096a23312f2e36181312c35e4fef))

## [10.0.4](https://github.com/projectcaluma/ember-alexandria/compare/v10.0.3...v10.0.4) (2024-11-15)


### Bug Fixes

* optimize responsive behavior of document list ([#1009](https://github.com/projectcaluma/ember-alexandria/issues/1009)) ([f7485ce](https://github.com/projectcaluma/ember-alexandria/commit/f7485ce936e40e9a3aa7546756b5c7e81d860031))
* **search-input:** make sure text selection works in search bar ([#1001](https://github.com/projectcaluma/ember-alexandria/issues/1001)) ([49ff2aa](https://github.com/projectcaluma/ember-alexandria/commit/49ff2aa32ae320538da5ce0c2b67ab5e6f914180))

## [10.0.3](https://github.com/projectcaluma/ember-alexandria/compare/v10.0.2...v10.0.3) (2024-11-13)


### Bug Fixes

* **category-nav:** when moving files, check if the moved file also matches the new category ([5980e9b](https://github.com/projectcaluma/ember-alexandria/commit/5980e9b187c2f0cc42b894d3138263f3a7a2b7b2))

## [10.0.2](https://github.com/projectcaluma/ember-alexandria/compare/v10.0.1...v10.0.2) (2024-10-03)


### Bug Fixes

* filter empty extensions in error message ([fe4f3bd](https://github.com/projectcaluma/ember-alexandria/commit/fe4f3bda90a667ae781e6a3ae6f1d9f816c1052b))
* **nav:** upload of preview images ([#952](https://github.com/projectcaluma/ember-alexandria/issues/952)) ([4f91fea](https://github.com/projectcaluma/ember-alexandria/commit/4f91feaf6cda31de2ad67192d674e881124acf92))

## [10.0.1](https://github.com/projectcaluma/ember-alexandria/compare/v10.0.0...v10.0.1) (2024-09-16)


### Bug Fixes

* controller lookup (tag removal) ([f02cfbc](https://github.com/projectcaluma/ember-alexandria/commit/f02cfbc7c6c4fcef5b652c96956da41fde6039ca))

# [10.0.0](https://github.com/projectcaluma/ember-alexandria/compare/v9.0.1...v10.0.0) (2024-08-30)


* fix!: make document title and description not localized ([3ffcfbd](https://github.com/projectcaluma/ember-alexandria/commit/3ffcfbda0d163d87352be8011a4552a38eaac964))


### BREAKING CHANGES

* This turns the document's title and description into
regular CharFields/TextFields, instead of localized ones, because
localized fields do not make sense for user-generated data.

## [9.0.1](https://github.com/projectcaluma/ember-alexandria/compare/v9.0.0...v9.0.1) (2024-08-27)


### Bug Fixes

* add italian translations ([7c48a14](https://github.com/projectcaluma/ember-alexandria/commit/7c48a1485825f284565a1e6c18ea362f9e290017))

# [9.0.0](https://github.com/projectcaluma/ember-alexandria/compare/v8.3.1...v9.0.0) (2024-08-06)


### Bug Fixes

* **deps:** remove direct dependency to ember-data ([8801016](https://github.com/projectcaluma/ember-alexandria/commit/8801016c692cae3e2e8f1a12a9c1b4168e59226a))
* **deps:** update ember-intl and ember-localized-model ([b32db48](https://github.com/projectcaluma/ember-alexandria/commit/b32db48c394a038bd32620f6535ac74ff4e95db7))


### BREAKING CHANGES

* **deps:** Please refer to the [documentation](MIGRATIONS.md).
* **deps:** This engine now requires the usage of `ember-intl` v7.

# [9.0.0-beta.1](https://github.com/projectcaluma/ember-alexandria/compare/v8.3.1...v9.0.0-beta.1) (2024-07-30)


### Bug Fixes

* **deps:** remove direct dependency to ember-data ([8801016](https://github.com/projectcaluma/ember-alexandria/commit/8801016c692cae3e2e8f1a12a9c1b4168e59226a))
* **deps:** update ember-intl and ember-localized-model ([b32db48](https://github.com/projectcaluma/ember-alexandria/commit/b32db48c394a038bd32620f6535ac74ff4e95db7))


### BREAKING CHANGES

* **deps:** Please refer to the [documentation](MIGRATIONS.md).
* **deps:** This engine now requires the usage of `ember-intl` v7.

## [8.3.1](https://github.com/projectcaluma/ember-alexandria/compare/v8.3.0...v8.3.1) (2024-07-11)


### Bug Fixes

* **search:** improve search list experience ([cf8f92a](https://github.com/projectcaluma/ember-alexandria/commit/cf8f92a6cc1257501ad6ee2c12b326128423f121))

# [8.3.0](https://github.com/projectcaluma/ember-alexandria/compare/v8.2.2...v8.3.0) (2024-07-10)


### Features

* **mark:** display description ([05c3d5c](https://github.com/projectcaluma/ember-alexandria/commit/05c3d5c8eed1c2df83794a5c6478257bf467839c))

## [8.2.2](https://github.com/projectcaluma/ember-alexandria/compare/v8.2.1...v8.2.2) (2024-06-26)


### Bug Fixes

* **details:** show loading states for action buttons ([dad3b99](https://github.com/projectcaluma/ember-alexandria/commit/dad3b995275318467cee777a3f86c147cb03e281))

## [8.2.1](https://github.com/projectcaluma/ember-alexandria/compare/v8.2.0...v8.2.1) (2024-06-24)


### Bug Fixes

* **errors:** fix error handling when deleting documents ([6d220d5](https://github.com/projectcaluma/ember-alexandria/commit/6d220d5af4712395d750f116d85799ed7e075b73))

# [8.2.0](https://github.com/projectcaluma/ember-alexandria/compare/v8.1.1...v8.2.0) (2024-06-13)


### Bug Fixes

* **list:** add loading state ([f240a5c](https://github.com/projectcaluma/ember-alexandria/commit/f240a5c270ba2871ce6577c46d00a0d06e1dedbd))


### Features

* **list:** add url for LinkTo generation ([e1f376d](https://github.com/projectcaluma/ember-alexandria/commit/e1f376d3e81a5e3c79bee1c8cacb25c04a22404e))

## [8.1.1](https://github.com/projectcaluma/ember-alexandria/compare/v8.1.0...v8.1.1) (2024-06-10)


### Bug Fixes

* link to correct licence ([#854](https://github.com/projectcaluma/ember-alexandria/issues/854)) ([60544dd](https://github.com/projectcaluma/ember-alexandria/commit/60544dde628525bd4183f1ae9780a779577889cd))

# [8.1.0](https://github.com/projectcaluma/ember-alexandria/compare/v8.0.4...v8.1.0) (2024-06-05)


### Bug Fixes

* **css:** selected color should win over striped table ([#835](https://github.com/projectcaluma/ember-alexandria/issues/835)) ([13a1506](https://github.com/projectcaluma/ember-alexandria/commit/13a15065e1a190b7510d3cbc59563a44c034d0df))
* fix minor typos in error messages ([841a926](https://github.com/projectcaluma/ember-alexandria/commit/841a926d8859a5028bb150da867990fd99e4cb30))
* **styling:** fix styling of tags and marks ([4dd0a88](https://github.com/projectcaluma/ember-alexandria/commit/4dd0a88162bfef7a2981eeb1c4fefcc324efbae5))
* **styling:** make sure responsive rules take precedence ([f63276e](https://github.com/projectcaluma/ember-alexandria/commit/f63276eb6bf4e73477b7804c45084bb7ecacd6de))


### Features

* add file full text search ([#806](https://github.com/projectcaluma/ember-alexandria/issues/806)) ([ab1ac26](https://github.com/projectcaluma/ember-alexandria/commit/ab1ac2686e6d3c5e13629a3d8672927d05a89666))

## [8.0.4](https://github.com/projectcaluma/ember-alexandria/compare/v8.0.3...v8.0.4) (2024-05-22)


### Bug Fixes

* **layout:** improve layout for smaller screens ([7cf3ee5](https://github.com/projectcaluma/ember-alexandria/commit/7cf3ee5c8a70d6679abdb17eb4a4b4e81cd31149))

## [8.0.3](https://github.com/projectcaluma/ember-alexandria/compare/v8.0.2...v8.0.3) (2024-04-30)


### Bug Fixes

* **upload:** show error message if file is too large ([6198204](https://github.com/projectcaluma/ember-alexandria/commit/6198204c19c374af820769f7cef6f3da545c289c))

## [8.0.2](https://github.com/projectcaluma/ember-alexandria/compare/v8.0.1...v8.0.2) (2024-04-30)


### Bug Fixes

* **delete:** delete concurrently and clean up correctly ([0b412ad](https://github.com/projectcaluma/ember-alexandria/commit/0b412ad7d1457eebf9d852aee185468f15bd091a))
* **i18n:** fix translation typo ([9cccbca](https://github.com/projectcaluma/ember-alexandria/commit/9cccbca2edd12044bbecbf44703c8477c03d3ebf))
* remove content attr in serialization for patch ([9d7de0a](https://github.com/projectcaluma/ember-alexandria/commit/9d7de0acd56b8f07ca2081e8a00b932fe619a882))

## [8.0.1](https://github.com/projectcaluma/ember-alexandria/compare/v8.0.0...v8.0.1) (2024-04-24)


### Bug Fixes

* **mime:** softer mime type checking ([fab995b](https://github.com/projectcaluma/ember-alexandria/commit/fab995b88a6d5d845a0bc77629d331e341a1af70))

# [8.0.0](https://github.com/projectcaluma/ember-alexandria/compare/v7.1.2...v8.0.0) (2024-04-18)


### Bug Fixes

* make sure large thumbnails are rendered above search bar ([41ad6b5](https://github.com/projectcaluma/ember-alexandria/commit/41ad6b5630c50ddc8dc8c0e28095d5711d7b90da))
* move ember-test-selectors to dependencies ([6977cf5](https://github.com/projectcaluma/ember-alexandria/commit/6977cf58c695bb41d40ca03591723a255a5753f0))


* fix!: deprecate usage of ember-data 3 ([bec2702](https://github.com/projectcaluma/ember-alexandria/commit/bec27022bf6db3def84934b5c6eef6d0ede1adfb))


### Features

* upload document and file in one request ([c08888f](https://github.com/projectcaluma/ember-alexandria/commit/c08888f758b4ef151950a8364fa93887de444e8a))


### BREAKING CHANGES

* This removes support for ember data 3 versions

## [7.1.2](https://github.com/projectcaluma/ember-alexandria/compare/v7.1.1...v7.1.2) (2024-03-22)


### Bug Fixes

* **mime:** allow upload of msg files ([f0dd618](https://github.com/projectcaluma/ember-alexandria/commit/f0dd6184e0f01872e0ab7d75e5ca0e1edc799139))

## [7.1.1](https://github.com/projectcaluma/ember-alexandria/compare/v7.1.0...v7.1.1) (2024-03-21)


### Bug Fixes

* open latest file with double click ([29b626c](https://github.com/projectcaluma/ember-alexandria/commit/29b626cd5f7250da5e2cd736278d8673f332cb7f))

# [7.1.0](https://github.com/projectcaluma/ember-alexandria/compare/v7.0.4...v7.1.0) (2024-03-21)


### Bug Fixes

* add accept to file replace ([5e628dc](https://github.com/projectcaluma/ember-alexandria/commit/5e628dc67ec629bbbf0d90af53b1c0e645586b7b))
* **download:** always refresh document before download ([995ec84](https://github.com/projectcaluma/ember-alexandria/commit/995ec844460de6f51ee8a1efdc5d5e08f010901e))
* **tests:** test upload ([8f3d804](https://github.com/projectcaluma/ember-alexandria/commit/8f3d80427105775456eeeb6931e045f45fe4ff24))
* **upload:** use full mime as office uses vnd types ([7105db9](https://github.com/projectcaluma/ember-alexandria/commit/7105db98e84f73bcb3f354e2e2a732c28bbe467e))
* use utils folder ([5d7699b](https://github.com/projectcaluma/ember-alexandria/commit/5d7699bbe0f3416c93ca5cd88fddb002c30efe93))


### Features

* **category:** add upload for drag drop over category nav ([d2e7df5](https://github.com/projectcaluma/ember-alexandria/commit/d2e7df5d565d1673ac3a3c2d809de5be84f59863))
* implement mime type restriction for upload ([2773a08](https://github.com/projectcaluma/ember-alexandria/commit/2773a0828e1f464eca9db18588578f20524ffdaf))

## [7.0.4](https://github.com/projectcaluma/ember-alexandria/compare/v7.0.3...v7.0.4) (2024-03-19)


### Bug Fixes

* **details:** make sure description is resetted on document change ([7ed9583](https://github.com/projectcaluma/ember-alexandria/commit/7ed9583361330a60e5d64890fadbb8601b4a23a4))
* **errors:** display root level validation messages from backend ([89a3ef8](https://github.com/projectcaluma/ember-alexandria/commit/89a3ef889632233e097e02a1796fdc1bc15eeae8))

## [7.0.3](https://github.com/projectcaluma/ember-alexandria/compare/v7.0.2...v7.0.3) (2024-03-18)


### Bug Fixes

* only pass locale string to flatpickr ([709c415](https://github.com/projectcaluma/ember-alexandria/commit/709c415832b0d70e954333dae942c8ec217aad83))

## [7.0.2](https://github.com/projectcaluma/ember-alexandria/compare/v7.0.1...v7.0.2) (2024-03-18)


### Bug Fixes

* call correct method in document view ([45f6c83](https://github.com/projectcaluma/ember-alexandria/commit/45f6c83bd7b2638bf3eb15af86682a7ae1228703))

## [7.0.1](https://github.com/projectcaluma/ember-alexandria/compare/v7.0.0...v7.0.1) (2024-03-13)


### Bug Fixes

* **deps:** update dependencies ([4f18782](https://github.com/projectcaluma/ember-alexandria/commit/4f18782fc4383baafa308bcb2278e4e3e16bb494))

# [7.0.0](https://github.com/projectcaluma/ember-alexandria/compare/v6.0.1...v7.0.0) (2024-03-11)


### Bug Fixes

* **categories:** format alexandria category descriptions ([c7ff8b0](https://github.com/projectcaluma/ember-alexandria/commit/c7ff8b054f10e3a20b90d0f624426590ae101eeb))
* **convert:** typo for success message ([#708](https://github.com/projectcaluma/ember-alexandria/issues/708)) ([2a9cdae](https://github.com/projectcaluma/ember-alexandria/commit/2a9cdae38461c9c819f478e3cf77f9a1f5889e59))
* **documents:** fix inital selection with ctrl ([#729](https://github.com/projectcaluma/ember-alexandria/issues/729)) ([ef80fc3](https://github.com/projectcaluma/ember-alexandria/commit/ef80fc3e17524b079d5f62af9fda005a368bbfa6))
* **thumbnail:** make sure thumbnail of latest file is rendered ([#679](https://github.com/projectcaluma/ember-alexandria/issues/679)) ([38baf73](https://github.com/projectcaluma/ember-alexandria/commit/38baf73c868fe7ccabf92d9cae5dc7bf94a84e7d))
* update and fix flatpickr integration ([#710](https://github.com/projectcaluma/ember-alexandria/issues/710)) ([74d7f50](https://github.com/projectcaluma/ember-alexandria/commit/74d7f50d22282c3cca1e413a3ac9a4a331df8d8c))


### Features

* add button to convert to pdf ([#700](https://github.com/projectcaluma/ember-alexandria/issues/700)) ([223febe](https://github.com/projectcaluma/ember-alexandria/commit/223febe67c6475e6d91f8d746e6ca6e465b4c1ed))
* add web dav edit integration ([9d63feb](https://github.com/projectcaluma/ember-alexandria/commit/9d63feb631ce074da9a895259e256fff76263ffc))
* **api:** upload files directly via alexandria API ([f934fc4](https://github.com/projectcaluma/ember-alexandria/commit/f934fc487275252008fd069936b0afd3cdc7bb5f))
* change displayed modified date to be latest file creation ([6946f6f](https://github.com/projectcaluma/ember-alexandria/commit/6946f6fae7488c4843b83d7359ab04aed23509f2))


### BREAKING CHANGES

* **api:** Requires alexandria backend v3.0.0-beta.3

# [7.0.0-beta.1](https://github.com/projectcaluma/ember-alexandria/compare/v6.0.1...v7.0.0-beta.1) (2024-01-18)


### Features

* **api:** upload files directly via alexandria API ([f934fc4](https://github.com/projectcaluma/ember-alexandria/commit/f934fc487275252008fd069936b0afd3cdc7bb5f))


### BREAKING CHANGES

* **api:** Requires alexandria backend v3.0.0-beta.3

## [6.0.1](https://github.com/projectcaluma/ember-alexandria/compare/v6.0.0...v6.0.1) (2024-01-12)


### Bug Fixes

* **category:** reset drag state after drop ([35879e4](https://github.com/projectcaluma/ember-alexandria/commit/35879e4e42264ba834de942ef68448f24e9f5684))
* **download:** ensure file ordering ([76b0cdb](https://github.com/projectcaluma/ember-alexandria/commit/76b0cdb88b8009aa6e376d10e8fbf2d90fd4e1ba))

# [6.0.0](https://github.com/projectcaluma/ember-alexandria/compare/v5.1.3...v6.0.0) (2024-01-11)


* feat!: use fetch service ([9f727db](https://github.com/projectcaluma/ember-alexandria/commit/9f727db63a4e48f6afb4d2bcd7d56059180b56b8))


### BREAKING CHANGES

* The addon now requires a fetch service that handles
authentication. See `dummy/app/services/fetch.js` for an example
implementation.

## [5.1.3](https://github.com/projectcaluma/ember-alexandria/compare/v5.1.2...v5.1.3) (2024-01-09)


### Bug Fixes

* reset documents on nav correctly ([93e7155](https://github.com/projectcaluma/ember-alexandria/commit/93e7155aa05174a967a2c67f28d4b6d2255ad2e9))

## [5.1.2](https://github.com/projectcaluma/ember-alexandria/compare/v5.1.1...v5.1.2) (2024-01-05)


### Bug Fixes

* **selection:** fix regression in shift selection ([251f44b](https://github.com/projectcaluma/ember-alexandria/commit/251f44b53cc5a2a15f4b65e4d6c7ea9613fab0e9))

## [5.1.1](https://github.com/projectcaluma/ember-alexandria/compare/v5.1.0...v5.1.1) (2024-01-05)


### Bug Fixes

* **marks:** update filter when setting mark ([a3b283b](https://github.com/projectcaluma/ember-alexandria/commit/a3b283ba732527b220f78d4fcd973796323de3b7))

# [5.1.0](https://github.com/projectcaluma/ember-alexandria/compare/v5.0.2...v5.1.0) (2024-01-04)


### Features

* **document:** allow moving of a document per drag & drop ([7ba1835](https://github.com/projectcaluma/ember-alexandria/commit/7ba1835fd66c4cd5e0b8c6ff59ffa17a68cb2abd))

## [5.0.2](https://github.com/projectcaluma/ember-alexandria/compare/v5.0.1...v5.0.2) (2024-01-04)


### Bug Fixes

* **tag:** use namespaced tag service ([9aab258](https://github.com/projectcaluma/ember-alexandria/commit/9aab2588624181e91d88ab388b6cc1241b7148c0))

## [5.0.1](https://github.com/projectcaluma/ember-alexandria/compare/v5.0.0...v5.0.1) (2024-01-03)


### Bug Fixes

* **tag:** update filter after adding tag ([4032ac9](https://github.com/projectcaluma/ember-alexandria/commit/4032ac9760177c68842684bb99ee25fc067ec07a))

# [5.0.0](https://github.com/projectcaluma/ember-alexandria/compare/v4.9.1...v5.0.0) (2024-01-03)


### Bug Fixes

* **services:** namespace all services ([17766ea](https://github.com/projectcaluma/ember-alexandria/commit/17766ea1604222aa2014f5206a278979dfbedf73))


### chore

* **compatibility:** add compatibility tests for ember LTS 5.4 ([b6a7b28](https://github.com/projectcaluma/ember-alexandria/commit/b6a7b288417dd6afa580fcbdede9aab055f1980c))


### BREAKING CHANGES

* **compatibility:** Remove support for deprecated ember LTS versions 4.4
and 4.8.
* **services:** All services are now namespaced with "alexandria-". If
your host app customized the config service, you'll need to remove the
name customization in the passed services to the engine.

For further information, please take a look at the readme.

## [4.9.1](https://github.com/projectcaluma/ember-alexandria/compare/v4.9.0...v4.9.1) (2023-12-29)


### Bug Fixes

* reset query params ([2073a0d](https://github.com/projectcaluma/ember-alexandria/commit/2073a0d2214f713358e641bef92affa27efdb79c))
* **tag-filter:** only show active marks ([66280c5](https://github.com/projectcaluma/ember-alexandria/commit/66280c5eb7d69590e545b7cfc33eb9e7dc217506))
* **test:** fix fileSaver stub ([a1dae87](https://github.com/projectcaluma/ember-alexandria/commit/a1dae878d94d80a9573fab70eaaa94efeceb9e4f))

# [4.9.0](https://github.com/projectcaluma/ember-alexandria/compare/v4.8.0...v4.9.0) (2023-12-12)


### Bug Fixes

* **errors:** rollback changes after backend returns an error ([54ad8eb](https://github.com/projectcaluma/ember-alexandria/commit/54ad8ebd6d449e0438feb00939017a38e82418a0))


### Features

* **categories:** add a tooltip for categories ([01cc783](https://github.com/projectcaluma/ember-alexandria/commit/01cc783185a6eef3a8e797969aeb59e6ed35175f))

# [4.8.0](https://github.com/projectcaluma/ember-alexandria/compare/v4.7.0...v4.8.0) (2023-12-05)


### Bug Fixes

* **document:** allow saving title by pressing enter ([9789ed1](https://github.com/projectcaluma/ember-alexandria/commit/9789ed1d843468e5e507b8863c612cbafcb46987))
* **marks:** reset marks if request failed ([9ea5a1f](https://github.com/projectcaluma/ember-alexandria/commit/9ea5a1f74042c4228d8568a1b72b6983e0e5ee73))


### Features

* **marks:** add classes for each assigned mark on document elements ([7d7e0bf](https://github.com/projectcaluma/ember-alexandria/commit/7d7e0bf21ebc1eae1c54321b2ff5ae5dff23be47))

# [4.7.0](https://github.com/projectcaluma/ember-alexandria/compare/v4.6.5...v4.7.0) (2023-11-30)


### Features

* integrate marks model ([908d612](https://github.com/projectcaluma/ember-alexandria/commit/908d612dc7ddf35cb87c0bbd8074263e0638dc3c))

## [4.6.5](https://github.com/projectcaluma/ember-alexandria/compare/v4.6.4...v4.6.5) (2023-11-28)


### Reverts

* Revert "Revert "fix(upload): upload files with the proper content type header"" ([34760d1](https://github.com/projectcaluma/ember-alexandria/commit/34760d18842476cfcef6f9124be4cd096da9ed8e))

## [4.6.4](https://github.com/projectcaluma/ember-alexandria/compare/v4.6.3...v4.6.4) (2023-11-23)


### Reverts

* Revert "fix(upload): upload files with the proper content type header" ([b8ca7f5](https://github.com/projectcaluma/ember-alexandria/commit/b8ca7f5873cb2f4a2314c7f356936fd51d234594))

## [4.6.3](https://github.com/projectcaluma/ember-alexandria/compare/v4.6.2...v4.6.3) (2023-11-21)


### Bug Fixes

* **tags:** fix removing of a tag ([32d2009](https://github.com/projectcaluma/ember-alexandria/commit/32d2009e1fd2b8f42d3f80637ca1757bf153ed8c))
* **upload:** show loading spinner on drag & drop upload ([7b76628](https://github.com/projectcaluma/ember-alexandria/commit/7b766283eab60e9cfbc21ff3e1ae9e8f575b8459))

## [4.6.2](https://github.com/projectcaluma/ember-alexandria/compare/v4.6.1...v4.6.2) (2023-11-20)


### Bug Fixes

* **upload:** upload files with the proper content type header ([759d401](https://github.com/projectcaluma/ember-alexandria/commit/759d4011f832e1cbcc0c829976f2357ec89b525e))

## [4.6.1](https://github.com/projectcaluma/ember-alexandria/compare/v4.6.0...v4.6.1) (2023-11-16)


### Bug Fixes

* **search:** add missing translation ([5ceaa42](https://github.com/projectcaluma/ember-alexandria/commit/5ceaa42b0268ec39cd9f8c05eb0a44e0d3b93d22))
* **tags:** improve tag manager ([ffa5792](https://github.com/projectcaluma/ember-alexandria/commit/ffa5792022e08937a803ceef2864d150f8c52a1f))

# [4.6.0](https://github.com/projectcaluma/ember-alexandria/compare/v4.5.0...v4.6.0) (2023-11-13)


### Features

* **details:** show checksum of file variants ([2419c4d](https://github.com/projectcaluma/ember-alexandria/commit/2419c4dfb5779392a7e60ad0ab3ddc2cb6f27e31))

# [4.5.0](https://github.com/projectcaluma/ember-alexandria/compare/v4.4.0...v4.5.0) (2023-10-31)


### Features

* **document:** add manual document date ([89cfc01](https://github.com/projectcaluma/ember-alexandria/commit/89cfc018a332584084d0cc956fcb1619982fea2c))

# [4.4.0](https://github.com/projectcaluma/ember-alexandria/compare/v4.3.0...v4.4.0) (2023-10-25)


### Features

* handle 403 differently ([429f7e7](https://github.com/projectcaluma/ember-alexandria/commit/429f7e78fc321ac67dc077bbb103f46881229c58))
* open documents with double click ([676d393](https://github.com/projectcaluma/ember-alexandria/commit/676d39371babc1e1bad1a5807f82830d719f83d7))

# [4.3.0](https://github.com/projectcaluma/ember-alexandria/compare/v4.2.0...v4.3.0) (2023-09-14)


### Bug Fixes

* **download:** don't add extension if already present ([35901b9](https://github.com/projectcaluma/ember-alexandria/commit/35901b93b0dfb39a0464dd94a62057d8d382d37b))
* fix tag test ([0381737](https://github.com/projectcaluma/ember-alexandria/commit/0381737396491477eafc925211794868153c65af))
* minor CSS improvements, add marks config to dummy app ([9d10ebe](https://github.com/projectcaluma/ember-alexandria/commit/9d10ebe91943cbd501a3bfeb3fbd92cadec581df))
* tag styling ([5cc0c77](https://github.com/projectcaluma/ember-alexandria/commit/5cc0c7779a5f0e52b3598059d2999c957c45f6e2))


### Features

* add marks ([5e1f080](https://github.com/projectcaluma/ember-alexandria/commit/5e1f08085fa4593670c7fbd8d24decd99878a238))
* add marks to document list and grid ([e2c8d3e](https://github.com/projectcaluma/ember-alexandria/commit/e2c8d3e373db34e04fcdfe1ace916d06a437a13f))
* add marks to filter bar ([7e1a937](https://github.com/projectcaluma/ember-alexandria/commit/7e1a937f0c257a64bd9f62a4d1176663ab6c1baa))
* **mark:** use fontawesome icons ([e726fea](https://github.com/projectcaluma/ember-alexandria/commit/e726fea6df5614bef47b2bc0d48edeaea2e7f449))

# [4.2.0](https://github.com/projectcaluma/ember-alexandria/compare/v4.1.0...v4.2.0) (2023-09-06)


### Bug Fixes

* **tags:** improve adding a new tag ([ebca426](https://github.com/projectcaluma/ember-alexandria/commit/ebca4260df6f2bab20e2055af15892280a1aed4a))


### Features

* add post process function after documents list fetch ([eafff12](https://github.com/projectcaluma/ember-alexandria/commit/eafff125ddf01202712e26496546e15af2abd349))

# [4.1.0](https://github.com/projectcaluma/ember-alexandria/compare/v4.0.6...v4.1.0) (2023-08-23)


### Bug Fixes

* **styling:** fix css classes ([9d7b9d6](https://github.com/projectcaluma/ember-alexandria/commit/9d7b9d67ca4c6fbd0cba809a52d22637892e0b7f))


### Features

* **category:** display nested categories ([ab75a63](https://github.com/projectcaluma/ember-alexandria/commit/ab75a63e831ba8b503d9a348af157f110fe81edc))
* **deps:** add support for ember-data 4 ([5bbdb64](https://github.com/projectcaluma/ember-alexandria/commit/5bbdb64384616d42c0bd4746d887f599842546a4))

## [4.0.6](https://github.com/projectcaluma/ember-alexandria/compare/v4.0.5...v4.0.6) (2023-06-15)


### Bug Fixes

* **documents:** fix fetching category for upload ([eb63dff](https://github.com/projectcaluma/ember-alexandria/commit/eb63dffafd99f7751cf76515c48b419e148c9832))

## [4.0.5](https://github.com/projectcaluma/ember-alexandria/compare/v4.0.4...v4.0.5) (2023-06-15)


### Bug Fixes

* **document:** allow service to be used outside of engine ([0db3064](https://github.com/projectcaluma/ember-alexandria/commit/0db30643d9280b12c3d7b9e5ce33ab06b7a12a40))

## [4.0.4](https://github.com/projectcaluma/ember-alexandria/compare/v4.0.3...v4.0.4) (2023-05-22)


### Bug Fixes

* **deps:** bump ember-localized-model to fix file rename bug ([5b0e4d2](https://github.com/projectcaluma/ember-alexandria/commit/5b0e4d28b896563c9653ee0cb10058a222398799))

## [4.0.3](https://github.com/projectcaluma/ember-alexandria/compare/v4.0.2...v4.0.3) (2023-05-11)


### Bug Fixes

* **tags:** fix outdated tags filter ([420289c](https://github.com/projectcaluma/ember-alexandria/commit/420289c49f97d99420d66870799a54a5b9c3c6a9))

## [4.0.2](https://github.com/projectcaluma/ember-alexandria/compare/v4.0.1...v4.0.2) (2023-05-11)


### Bug Fixes

* fix history download ([473cffe](https://github.com/projectcaluma/ember-alexandria/commit/473cffef3783472a4b00a1cc6989e67456940377))
* **routing:** use ember-engines-router-service for routing ([27bf3e9](https://github.com/projectcaluma/ember-alexandria/commit/27bf3e9bcb08c163634fcedeaf2fcd8dc04cfcf4))
* use renamed fields from the backend ([25c8e22](https://github.com/projectcaluma/ember-alexandria/commit/25c8e22305a1abfc005af2fd4d9da523c192909c))

## [4.0.1](https://github.com/projectcaluma/ember-alexandria/compare/v4.0.0...v4.0.1) (2023-05-03)


### Bug Fixes

* **deps:** downgrade ember-intl to stable version ([6871274](https://github.com/projectcaluma/ember-alexandria/commit/68712741928ac73eb3454ffb9f376f0b7be0542f))

# [4.0.0](https://github.com/projectcaluma/ember-alexandria/compare/v3.0.0...v4.0.0) (2023-05-01)


### Bug Fixes

* pin ember-data to 4.0.0 ([dc82010](https://github.com/projectcaluma/ember-alexandria/commit/dc820106a3a786f600321a6b6560fd5a75492979))
* **scss:** import uikit variables without alias ([053524c](https://github.com/projectcaluma/ember-alexandria/commit/053524cca8c4870258ee4f16e2899797c17a86c5))


### chore

* **deps:** update dependencies ([cfe322f](https://github.com/projectcaluma/ember-alexandria/commit/cfe322f285b5879ceadd9e65451a9056b3a4d216))


* chore!: update most packages ([fb95f6b](https://github.com/projectcaluma/ember-alexandria/commit/fb95f6b72a8fa68f76d3b18cbbba50e709e34055))


### BREAKING CHANGES

* **deps:** Drop support for Ember v3.
* drop node v14 support

# [3.0.0](https://github.com/projectcaluma/ember-alexandria/compare/v2.0.0...v3.0.0) (2023-03-24)


### Bug Fixes

* **service:** return created documents ([708a057](https://github.com/projectcaluma/ember-alexandria/commit/708a05775835c6d3cd5cfda5cd875a1fd4f910fc))


### Features

* **deps:** add compatibility with Ember v4 ([0c733a3](https://github.com/projectcaluma/ember-alexandria/commit/0c733a3892d01329d7bd4a3c9fff8569fb122caa))


### BREAKING CHANGES

* **deps:** Drop support for node v12.

# [2.0.0](https://github.com/projectcaluma/ember-alexandria/compare/v1.11.3...v2.0.0) (2022-11-09)


### Bug Fixes

* **config:** allow namespace to be configured ([622f291](https://github.com/projectcaluma/ember-alexandria/commit/622f29122f65f44d78dce3bb8c597dee596bacae))
* live up to stricter eslint rules ([a8f2a87](https://github.com/projectcaluma/ember-alexandria/commit/a8f2a8753a31fd47a70c18007d312f00c8feeb59))


* chore!(deps):  upgrade core deps ([1df788f](https://github.com/projectcaluma/ember-alexandria/commit/1df788f55a67750001eefd60cc62fbad66efd601))


### BREAKING CHANGES

* **config:** This commit changes the consumed services of the engine.
New, the engine requires `session`, `intl`, `notification`, `router`, `config`.
The dependencies are documented in the README.md.

Minor fixes:
- use optional chaining for lookup
- update some dependencies
- unpin ember-data
* - minimum node version: 12.22 and above or node >15

## [1.11.3](https://github.com/projectcaluma/ember-alexandria/compare/v1.11.2...v1.11.3) (2022-04-01)


### Bug Fixes

* reset document selection ([005785b](https://github.com/projectcaluma/ember-alexandria/commit/005785b82e605ae3b607fa6e8442409f499d12ae))
* reset document selection ([263214d](https://github.com/projectcaluma/ember-alexandria/commit/263214d37b7238af374fa53eb139aed254fa9ea9))

## [1.11.2](https://github.com/projectcaluma/ember-alexandria/compare/v1.11.1...v1.11.2) (2022-04-01)


### Bug Fixes

* reset document selection on navigating away ([2876e49](https://github.com/projectcaluma/ember-alexandria/commit/2876e49f8d6f074355667ce743afddf341d2e352))

## [1.11.1](https://github.com/projectcaluma/ember-alexandria/compare/v1.11.0...v1.11.1) (2021-11-25)


### Bug Fixes

* don't clear tag selection when selecting a document ([b01c971](https://github.com/projectcaluma/ember-alexandria/commit/b01c971c703b0517c4ebd7b857ee19a3bc236eb6))

# [1.11.0](https://github.com/projectcaluma/ember-alexandria/compare/v1.10.2...v1.11.0) (2021-10-27)


### Features

* resolve users and groups, add group column ([49a767e](https://github.com/projectcaluma/ember-alexandria/commit/49a767e6f024b73a3423f10d42ff2fc408dfd162))

## [1.10.2](https://github.com/projectcaluma/ember-alexandria/compare/v1.10.1...v1.10.2) (2021-10-22)


### Bug Fixes

* pin dev dependencies ([e945899](https://github.com/projectcaluma/ember-alexandria/commit/e94589994ba0addb00f308d025fe5fe528582391))
* when removing the tag remove it from the URL ([4288f66](https://github.com/projectcaluma/ember-alexandria/commit/4288f668a9a3ce4c0a6b48b3109910e088c7504b))
* **list-item:** Move inline styles out of component template. ([c772788](https://github.com/projectcaluma/ember-alexandria/commit/c772788c94d7fbd41cb3ceb0865edc10b494055a))
* **list-view:** adds modified translation key ([1055d10](https://github.com/projectcaluma/ember-alexandria/commit/1055d10a41fe4737a833cc34bbda728166cfd530))
* **list-view:** Change table headers and values ([7c02e1d](https://github.com/projectcaluma/ember-alexandria/commit/7c02e1d9c5e507406419742304e5f41e90c9d9c2))
* **list-view:** hides file type column header ([52c1e91](https://github.com/projectcaluma/ember-alexandria/commit/52c1e91ad310c039249fb3323f7feaa5f6fabb36))
* **list-view:** preserves width of filetype icon ([ec0ddb8](https://github.com/projectcaluma/ember-alexandria/commit/ec0ddb813fdce44e8b7e93a1b45e7971cb23e509))
* **list-view:** translate list view headers ([7affb2e](https://github.com/projectcaluma/ember-alexandria/commit/7affb2e8419b9d11e9dd35bebe04b4a57c701c1e))
* **list-view:** updates existing test assumptions ([54af058](https://github.com/projectcaluma/ember-alexandria/commit/54af0584ba1d7126d636e3db2348df22fad6a261))

## [1.10.1](https://github.com/projectcaluma/ember-alexandria/compare/v1.10.0...v1.10.1) (2021-09-30)


### Bug Fixes

* zip download works now ([1dbf49f](https://github.com/projectcaluma/ember-alexandria/commit/1dbf49f73d84522805a83f9a8553324f1e4b5658))

# [1.10.0](https://github.com/projectcaluma/ember-alexandria/compare/v1.9.1...v1.10.0) (2021-09-23)


### Bug Fixes

* added 'useYarn' to ember try to get try and get the ci to work ([7d46c6a](https://github.com/projectcaluma/ember-alexandria/commit/7d46c6a867ecd80871e84778eef3d166a4216e36))
* added missing tests for the side panel to show the download button or not ([ebd612a](https://github.com/projectcaluma/ember-alexandria/commit/ebd612adfd924436c3e1f3d651ea774aac7cd757))
* change ember-lts to 3.28 and CI should still run ([8305da0](https://github.com/projectcaluma/ember-alexandria/commit/8305da07ce86f3cd970cef070c8a5069fd08a1d5))
* due to document selection the document navigation had to be rebuilt using divs instead of links which broke the linter ([d391bb1](https://github.com/projectcaluma/ember-alexandria/commit/d391bb1bc4e388a2330195ce3ea8d36a1d1d01c7))
* enable ctrl-a in side panel ([a5e9063](https://github.com/projectcaluma/ember-alexandria/commit/a5e9063d930ef90cfa40b0d2b3f8dfbc9baaabe5))
* fix multi document tagging ([b63c55f](https://github.com/projectcaluma/ember-alexandria/commit/b63c55f09415ca2a0f9931c510b0d6d32ad81e87))
* fix tag manager ([bdb3c9a](https://github.com/projectcaluma/ember-alexandria/commit/bdb3c9aa19accdeefacf0f5a4882a483ee908890))
* fix test after adding missing translation ([a26bc04](https://github.com/projectcaluma/ember-alexandria/commit/a26bc043524d5d917a60ec9b871889b2868cd90e))
* fix the github release workflow ([6d467d6](https://github.com/projectcaluma/ember-alexandria/commit/6d467d6c7b373e7edbd548f1644f22227d2cda02))
* fixed linting errors ([1f2d7c5](https://github.com/projectcaluma/ember-alexandria/commit/1f2d7c58173d0375225c9a4c6ceadd37d4bf17f9))
* fixed tag manager with duplicate tags ([d0a51f3](https://github.com/projectcaluma/ember-alexandria/commit/d0a51f3103f5ff220c60df6a236a252622ba033a))
* fixed the document sorting and removed some comments in the tag service ([77f1280](https://github.com/projectcaluma/ember-alexandria/commit/77f1280f6ad0ebdac96daf22dd549a70ba5b5347))
* fixed the download button to be at the bottom again ([d48e949](https://github.com/projectcaluma/ember-alexandria/commit/d48e949207901502f94429973b4d4b0fe70be388))
* fixed the tests now(?) ([09cc7ee](https://github.com/projectcaluma/ember-alexandria/commit/09cc7ee5629d8c35905996f84721d8ab013edef4))
* last remaining comments per review ([a56e0aa](https://github.com/projectcaluma/ember-alexandria/commit/a56e0aa3a30cc3cc945a5551144f2a06631cc955))
* lint hbs and js sources ([661818f](https://github.com/projectcaluma/ember-alexandria/commit/661818f9366703112d2f8c8d9ed43b3bfa089e59))
* linting errors. linting errors everywhere. ([27416cf](https://github.com/projectcaluma/ember-alexandria/commit/27416cf5e76968560dfdb2f1404960a0f7c310ea))
* missing method in document service stub in test ([db5b4e3](https://github.com/projectcaluma/ember-alexandria/commit/db5b4e33e216ce419ede6d40a844a1bf9f9d2e00))
* missing translation ([be13ec7](https://github.com/projectcaluma/ember-alexandria/commit/be13ec74fd170f4ebebfe8dd0e8dbb03aeaf1b7e))
* pin the ember-moment PR to an issue instead of head ([c329861](https://github.com/projectcaluma/ember-alexandria/commit/c329861d3efd6b4c376bd65bbe421d0f40d4b7e0))
* refactor the document-view to move all the document selection stuff and initialisation into the document-service ([8724d3b](https://github.com/projectcaluma/ember-alexandria/commit/8724d3bca2a7544b400568a200b5753fa8fb19b7))
* remove 3.24 test from github workflow ([0ce5313](https://github.com/projectcaluma/ember-alexandria/commit/0ce53138a3eebb0d3dfd28eb43eeb0d48d9f93a9))
* remove commented out code ([9110775](https://github.com/projectcaluma/ember-alexandria/commit/91107751c2b7b9f0680b0551ffc3eb434e2bbca0))
* remove ember-moment ([d462a00](https://github.com/projectcaluma/ember-alexandria/commit/d462a000df84141158dd95c45177794f0e157fa1))
* remove moment-shims ([6152746](https://github.com/projectcaluma/ember-alexandria/commit/6152746c2ecada7792dfeff4a44136b11ebad676))
* updated Ember to v3.28.0 (+ removed some unnecessary resolutions) ([456fcf1](https://github.com/projectcaluma/ember-alexandria/commit/456fcf1d20ccb0ba4af5634a7a6c923cc9a258cb))
* updated the zip url to reflect the backend changes ([2d106ef](https://github.com/projectcaluma/ember-alexandria/commit/2d106ef36fe9b2f7117856c7e19c3558ea4db445))


### Features

* preparing for zip download implementation ([6f88a4e](https://github.com/projectcaluma/ember-alexandria/commit/6f88a4ec5a3255da868b4b9e0a9843822af3f18c))
* sorting for document-list ([8650a96](https://github.com/projectcaluma/ember-alexandria/commit/8650a962adc5413825f8607f0cb95cfe4e1aa8cd))


### Reverts

* Revert "chore: fixed comments" ([201529d](https://github.com/projectcaluma/ember-alexandria/commit/201529d7491428d34857992b127b8291533bb44e))

## [1.9.1](https://github.com/projectcaluma/ember-alexandria/compare/v1.9.0...v1.9.1) (2021-05-27)


### Bug Fixes

* prevent input lag by adding timeout ([b15b2c2](https://github.com/projectcaluma/ember-alexandria/commit/b15b2c2f721e5a15f9c18beea64333f8b22a1950))

# [1.9.0](https://github.com/projectcaluma/ember-alexandria/compare/v1.8.1...v1.9.0) (2021-04-15)


### Bug Fixes

* reduce test matrix ([e92d567](https://github.com/projectcaluma/ember-alexandria/commit/e92d56796aa6fe2fe5c14ff63063857d38dc0979))


### Features

* **resolve-api:** async support ([af47baa](https://github.com/projectcaluma/ember-alexandria/commit/af47baac3303cbd81dad6592dfb84438dc022ecb))

## [1.8.1](https://github.com/projectcaluma/ember-alexandria/compare/v1.8.0...v1.8.1) (2021-04-14)


### Bug Fixes

* **document-card:** add file extension from last upload to filename ([7bee075](https://github.com/projectcaluma/ember-alexandria/commit/7bee075e2b9fdceaa4fc2699ca72b461a75a9e5f))

# [1.8.0](https://github.com/projectcaluma/ember-alexandria/compare/v1.7.0...v1.8.0) (2021-04-14)


### Bug Fixes

* **search:** move onSubmit handler to correct element ([837b554](https://github.com/projectcaluma/ember-alexandria/commit/837b55434115dc014f21eddf67aa12cf06fae80c))


### Features

* **document-details:** add filename to file history ([c6c08df](https://github.com/projectcaluma/ember-alexandria/commit/c6c08df618e3734398140fdbf61526eab6f930b3))

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
