# VERSION 2.16.0 Release Note

### 💥 Breaking Changes

### Deprecations

 - Remove data enhancements config and readonly flag. Removes dead url link, ([#7291](https://github.com/opensearch-project/OpenSearch-Dashboards/pull/7291))

### 🛡 Security

 - [CVE-2024-28863] Bump tar from 6.1.11 to 6.2.1 ([#6492](https://github.com/opensearch-project/OpenSearch-Dashboards/pull/6492))
 - [CVE-2024-33883] Bump ejs from `3.1.7` to `3.1.10` ([#6770](https://github.com/opensearch-project/OpenSearch-Dashboards/pull/6770))
 - [CVE-2024-4067][CVE-2024-4068] Bump packages dependent on `braces` versions lower than 3.0.3 ([#6911](https://github.com/opensearch-project/OpenSearch-Dashboards/pull/6911))
 - [GHSA-x565-32qp-m3vf] Bump `jimp` to remove phin dependency ([#6977](https://github.com/opensearch-project/OpenSearch-Dashboards/pull/6977))
 - [SNYK-JS-AXIOS-6144788] Bump axios to `1.7.2` ([#7149](https://github.com/opensearch-project/OpenSearch-Dashboards/pull/7149))
 - [CVE-2024-37890] Bump ws from `8.5.0` to `8.17.1` and from `7.5.7` to `7.5.10` ([#7153](https://github.com/opensearch-project/OpenSearch-Dashboards/pull/7153))

### 📈 Features/Enhancements

 - Make theme and dark mode settings user/device specific (in local storage), with opt-out ([#5652](https://github.com/opensearch-project/OpenSearch-Dashboards/pull/5652))
 - [Workspace]Import sample data to current workspace ([#6105](https://github.com/opensearch-project/OpenSearch-Dashboards/pull/6105))
 - [Data Explorer] Allow render from View directly, not from Data Explorer ([#6167](https://github.com/opensearch-project/OpenSearch-Dashboards/pull/6167))
 - [MDS] Allow querying from data sources in Timeline visualizations ([#6385](https://github.com/opensearch-project/OpenSearch-Dashboards/pull/6385))
 - [MDS] Prevent importing of data source object when MDS is not enabled ([#6395](https://github.com/opensearch-project/OpenSearch-Dashboards/pull/6395))
 - [VisBuilder] Change VisBuilder from experimental to production ([#6436](https://github.com/opensearch-project/OpenSearch-Dashboards/pull/6436))
 - Adds `migrations.delete` to delete saved objects by type during a migration ([#6443](https://github.com/opensearch-project/OpenSearch-Dashboards/pull/6443))
 - [Workspace] Duplicate selected/all saved objects ([#6478](https://github.com/opensearch-project/OpenSearch-Dashboards/pull/6478))
 - [Workspace] Dashboard admin(groups/users) implementation. ([#6554](https://github.com/opensearch-project/OpenSearch-Dashboards/pull/6554))
 - Support language selector from the data plugin ([#6613](https://github.com/opensearch-project/OpenSearch-Dashboards/pull/6613))
 - Add Server Side Batching for UI Metric Colector ([#6721](https://github.com/opensearch-project/OpenSearch-Dashboards/pull/6721))
 - Make Field Name Search Filter Case Insensitive ([#6759](https://github.com/opensearch-project/OpenSearch-Dashboards/pull/6759))
 - Add data source selection service to support storing and getting selected data source updates ([#6827](https://github.com/opensearch-project/OpenSearch-Dashboards/pull/6827))
 - [Workspace] Only OSD admin can create workspace ([#6831](https://github.com/opensearch-project/OpenSearch-Dashboards/pull/6831))
 - [Workspace]Add use cases to workspace form ([#6887](https://github.com/opensearch-project/OpenSearch-Dashboards/pull/6887))
 - Add missing aria-label for discover page ([#6898](https://github.com/opensearch-project/OpenSearch-Dashboards/pull/6898))
 - Remove endpoint validation for create data source saved object API ([#6899](https://github.com/opensearch-project/OpenSearch-Dashboards/pull/6899))
 - [Workspace] Change description field to textarea ([#6907](https://github.com/opensearch-project/OpenSearch-Dashboards/pull/6907))
 - Use JSON11 for handling long numerals ([#6915](https://github.com/opensearch-project/OpenSearch-Dashboards/pull/6915))
 - [MDS] Allow adding sample data for Timeline visualizations ([#6919](https://github.com/opensearch-project/OpenSearch-Dashboards/pull/6919))
 - [Multi DataSource] Add removedComponentIds for data source selection service ([#6920](https://github.com/opensearch-project/OpenSearch-Dashboards/pull/6920))
 - [MD]Use placeholder for data source credentials fields when export saved object ([#6928](https://github.com/opensearch-project/OpenSearch-Dashboards/pull/6928))
 - Query editor and UI settings toggle ([#7001](https://github.com/opensearch-project/OpenSearch-Dashboards/pull/7001))
 - Add search bar extensions ([#7034](https://github.com/opensearch-project/OpenSearch-Dashboards/pull/7034))
 - [Workspace] Refactor the UI of workspace picker ([#7045](https://github.com/opensearch-project/OpenSearch-Dashboards/pull/7045))
 - Render the datasource selector component conditionally ([#7059](https://github.com/opensearch-project/OpenSearch-Dashboards/pull/7059))
 - Introduce new interface for group ([#7060](https://github.com/opensearch-project/OpenSearch-Dashboards/pull/7060))
 - Support data source assignment in workspace. ([#7101](https://github.com/opensearch-project/OpenSearch-Dashboards/pull/7101))
 - [Workspace] Capabilities service add dashboard admin flag ([#7103](https://github.com/opensearch-project/OpenSearch-Dashboards/pull/7103))
 - Onboard dataframes support to MDS and create dataframe before request ([#7106](https://github.com/opensearch-project/OpenSearch-Dashboards/pull/7106))
 - Enhance Drag & Drop functionality in Vis Builder ([#7107](https://github.com/opensearch-project/OpenSearch-Dashboards/pull/7107))
 - Comply `recent items` with workspace ([#7115](https://github.com/opensearch-project/OpenSearch-Dashboards/pull/7115))
 - [Navigation-next] Add register nav group updater in chrome service ([#7117](https://github.com/opensearch-project/OpenSearch-Dashboards/pull/7117))
 - [Workspace] Refactor workspace form UI ([#7133](https://github.com/opensearch-project/OpenSearch-Dashboards/pull/7133))
 - [MDS] Observability Datasource Plugin migration with MDS support ([#7143](https://github.com/opensearch-project/OpenSearch-Dashboards/pull/7143))
 - Add description field in App. ([#7152](https://github.com/opensearch-project/OpenSearch-Dashboards/pull/7152))
 - Query editor and dataframes datasources container ([#7157](https://github.com/opensearch-project/OpenSearch-Dashboards/pull/7157))
 - [Workspace] Delete the virtual global workspace ([#7165](https://github.com/opensearch-project/OpenSearch-Dashboards/pull/7165))
 - 1. Add current nav group into chrome service 2. Prepend current nav group into breadcrumb ([#7166](https://github.com/opensearch-project/OpenSearch-Dashboards/pull/7166))
 - [QueryEditorExtensions] change `isEnabled` to an observable ([#7183](https://github.com/opensearch-project/OpenSearch-Dashboards/pull/7183))
 - Support workspace level default data source ([#7188](https://github.com/opensearch-project/OpenSearch-Dashboards/pull/7188))
 - Introduced an new plugin contentManagement for dynamic content rendering ([#7201](https://github.com/opensearch-project/OpenSearch-Dashboards/pull/7201))
 - Address styling of non-primary buttons by making secondary/empty ([#7211](https://github.com/opensearch-project/OpenSearch-Dashboards/pull/7211))
 - Add query enhancements plugin as a core plugin ([#7212](https://github.com/opensearch-project/OpenSearch-Dashboards/pull/7212))
 - Hide select data source panel for non dashboard admin in workspace create/edit page ([#7213](https://github.com/opensearch-project/OpenSearch-Dashboards/pull/7213))
 - [DataSource] Restrict to edit data source on the DSM UI. ([#7214](https://github.com/opensearch-project/OpenSearch-Dashboards/pull/7214))
 - Use registered nav group as workspace use case ([#7221](https://github.com/opensearch-project/OpenSearch-Dashboards/pull/7221))
 - [navigation-next] Add new left navigation ([#7230](https://github.com/opensearch-project/OpenSearch-Dashboards/pull/7230))
 - Add all use case ([#7235](https://github.com/opensearch-project/OpenSearch-Dashboards/pull/7235))
 - [navigation-next] add recent works in new homepage ([#7237](https://github.com/opensearch-project/OpenSearch-Dashboards/pull/7237))
 - [Workspace] Support workspace detail page ([#7241](https://github.com/opensearch-project/OpenSearch-Dashboards/pull/7241))
 - [Workspace] Register workspace settings under setup and settings ([#7242](https://github.com/opensearch-project/OpenSearch-Dashboards/pull/7242))
 - Register workspace list card into home page ([#7247](https://github.com/opensearch-project/OpenSearch-Dashboards/pull/7247))
 - Add recent items popup in top navigation ([#7257](https://github.com/opensearch-project/OpenSearch-Dashboards/pull/7257))
 - [navigation-next] Add new category ([#7275](https://github.com/opensearch-project/OpenSearch-Dashboards/pull/7275))
 - Enable landing page for settings and data administration ([#7282](https://github.com/opensearch-project/OpenSearch-Dashboards/pull/7282))
 - Support PPL in vega visualization ([#7285](https://github.com/opensearch-project/OpenSearch-Dashboards/pull/7285))
 - [VisBuilder] Add Capability to generate dynamic vega ([#7288](https://github.com/opensearch-project/OpenSearch-Dashboards/pull/7288))
 - Recover data source management in workspace ([#7296](https://github.com/opensearch-project/OpenSearch-Dashboards/pull/7296))
 - Disable certain routes when data_source.manageableBy is none ([#7298](https://github.com/opensearch-project/OpenSearch-Dashboards/pull/7298))
 - [navigation-next] fix: redirect to standard index pattern applications while nav group is enabled ([#7305](https://github.com/opensearch-project/OpenSearch-Dashboards/pull/7305))
 - Disable inputs in edit data source screen when data_source.manageableBy is none ([#7307](https://github.com/opensearch-project/OpenSearch-Dashboards/pull/7307))
 - Update query enhancement UI ([#7309](https://github.com/opensearch-project/OpenSearch-Dashboards/pull/7309))
 - [Workspace]Add "All use case" option to workspace form ([#7318](https://github.com/opensearch-project/OpenSearch-Dashboards/pull/7318))
 - [MDS] Data Connection details page with MDS support ([#7323](https://github.com/opensearch-project/OpenSearch-Dashboards/pull/7323))
 - Use compressed DataSourceSelector ([#7329](https://github.com/opensearch-project/OpenSearch-Dashboards/pull/7329))
 - [Workspace] Register four get started cards in home page ([#7333](https://github.com/opensearch-project/OpenSearch-Dashboards/pull/7333))
 - [Auto Suggest] OpenSearch SQL autosuggest with ANTLR ([#7336](https://github.com/opensearch-project/OpenSearch-Dashboards/pull/7336))
 - [navigation-next] update category ([#7339](https://github.com/opensearch-project/OpenSearch-Dashboards/pull/7339))
 - Add home page static list card ([#7351](https://github.com/opensearch-project/OpenSearch-Dashboards/pull/7351))
 - [Workspace]Hide create workspace button for non dashboard admin ([#7357](https://github.com/opensearch-project/OpenSearch-Dashboards/pull/7357))
 - Enrich breadcrumbs by workspace and use case ([#7360](https://github.com/opensearch-project/OpenSearch-Dashboards/pull/7360))
 - Bump OUI to 1.8.0 ([#7363](https://github.com/opensearch-project/OpenSearch-Dashboards/pull/7363))
 - [MDS] Observability Datasource Plugin migration with MDS support for Data Connection Table ([#7371](https://github.com/opensearch-project/OpenSearch-Dashboards/pull/7371))
 - Add MDS support along with a few cleanup and tests update ([#7463](https://github.com/opensearch-project/OpenSearch-Dashboards/pull/7463))
 - Add back data set navigator to control state issues ([#7492](https://github.com/opensearch-project/OpenSearch-Dashboards/pull/7492))
 - Fix discover options' location ([#7581](https://github.com/opensearch-project/OpenSearch-Dashboards/pull/7581))

### 🐛 Bug Fixes

 - [VisBuilder][BUG] Flat render structure in Metric and Table Vis ([#6674](https://github.com/opensearch-project/OpenSearch-Dashboards/pull/6674))
 - [MDS] Add a new message to data source components when there are no compatible datasources ([#6678](https://github.com/opensearch-project/OpenSearch-Dashboards/pull/6678))
 - Adjust the padding size for aggregated view ([#6715](https://github.com/opensearch-project/OpenSearch-Dashboards/pull/6715))
 - Add more test for icon and aggregated view ([#6729](https://github.com/opensearch-project/OpenSearch-Dashboards/pull/6729))
 - [OSD Availability] Prevent OSD process crashes when disk is full ([#6733](https://github.com/opensearch-project/OpenSearch-Dashboards/pull/6733))
 - Add test for edit data source form ([#6742](https://github.com/opensearch-project/OpenSearch-Dashboards/pull/6742))
 - Add test for data_source_error_menu, data_source_item, data_source_multi_selectable ([#6752](https://github.com/opensearch-project/OpenSearch-Dashboards/pull/6752))
 - Add test for toast button and validation form ([#6755](https://github.com/opensearch-project/OpenSearch-Dashboards/pull/6755))
 - Show error toast when fail to delete saved objects ([#6756](https://github.com/opensearch-project/OpenSearch-Dashboards/pull/6756))
 - Lint checker failure fix ([#6771](https://github.com/opensearch-project/OpenSearch-Dashboards/pull/6771))
 - Fix workspace name duplication check ([#6776](https://github.com/opensearch-project/OpenSearch-Dashboards/pull/6776))
 - Error message is not formatted in vis_type_vega url parser. ([#6777](https://github.com/opensearch-project/OpenSearch-Dashboards/pull/6777))
 - [Discover][Bug] Migrate global state from legacy URL ([#6780](https://github.com/opensearch-project/OpenSearch-Dashboards/pull/6780))
 - Quickrange selection fix ([#6782](https://github.com/opensearch-project/OpenSearch-Dashboards/pull/6782))
 - Bug Fixes for Vis Builder ([#6811](https://github.com/opensearch-project/OpenSearch-Dashboards/pull/6811))
 - Fix endpoint validation by passing in request when creating datasource client ([#6822](https://github.com/opensearch-project/OpenSearch-Dashboards/pull/6822))
 - Update index pattern references with data source when import sample data ([#6851](https://github.com/opensearch-project/OpenSearch-Dashboards/pull/6851))
 - Remove unused import and property which broke compilation ([#6879](https://github.com/opensearch-project/OpenSearch-Dashboards/pull/6879))
 - Fix not setting the default data source when creating data source bug ([#6908](https://github.com/opensearch-project/OpenSearch-Dashboards/pull/6908))
 - Close any open system flyout when changing view mode of the dashboard ([#6923](https://github.com/opensearch-project/OpenSearch-Dashboards/pull/6923))
 - Add TSVB Support for adding sample data ([#6940](https://github.com/opensearch-project/OpenSearch-Dashboards/pull/6940))
 - Fix web log sample visualization & vis-builder not rendering with data source issue ([#6948](https://github.com/opensearch-project/OpenSearch-Dashboards/pull/6948))
 - [MDS] Include data source name when importing a timeline visualization ([#6954](https://github.com/opensearch-project/OpenSearch-Dashboards/pull/6954))
 - Update z-index of sidecar container to make it more than mask, from 1000 to 1001. ([#6964](https://github.com/opensearch-project/OpenSearch-Dashboards/pull/6964))
 - [Discover] Check if the timestamp is already included to remove duplicate col ([#6983](https://github.com/opensearch-project/OpenSearch-Dashboards/pull/6983))
 - Highlight the anchor row in surrounding doc view ([#7025](https://github.com/opensearch-project/OpenSearch-Dashboards/pull/7025))
 - [MDS] Add data source engine type to data source saved object ([#7026](https://github.com/opensearch-project/OpenSearch-Dashboards/pull/7026))
 - Fix colors of the visualizations with more than 10 items ([#7051](https://github.com/opensearch-project/OpenSearch-Dashboards/pull/7051))
 - [BUG][NewHomePage] Temp Solution to avoid crash for anonymous user with no write permission ([#7054](https://github.com/opensearch-project/OpenSearch-Dashboards/pull/7054))
 - [Discover] Allow the last column of a table wider than the window to show up properly ([#7058](https://github.com/opensearch-project/OpenSearch-Dashboards/pull/7058))
 - Update error message in timeline visualization when MDS disabled ([#7069](https://github.com/opensearch-project/OpenSearch-Dashboards/pull/7069))
 - Fix object empty check and minor perf issue in query editor extensions ([#7077](https://github.com/opensearch-project/OpenSearch-Dashboards/pull/7077))
 - Remove angular related comment and code ([#7087](https://github.com/opensearch-project/OpenSearch-Dashboards/pull/7087))
 - [MDS][Version Decoupling] Add support of Version Decoupling in Index Patterns Dashboards Plugin ([#7100](https://github.com/opensearch-project/OpenSearch-Dashboards/pull/7100))
 - [Workspace]Restrict saved objects finding when workspace enabled ([#7125](https://github.com/opensearch-project/OpenSearch-Dashboards/pull/7125))
 - [MDS][Version Decoupling] Add support of required backend plugins check on data sources ([#7146](https://github.com/opensearch-project/OpenSearch-Dashboards/pull/7146))
 - [MDS] Fix the dsm plugin setup when mds feature flag is disabled ([#7163](https://github.com/opensearch-project/OpenSearch-Dashboards/pull/7163))
 - [MDS][Version Decoupling] Add dataSourceVersion' and  'installedPlugins in viewer returns ([#7172](https://github.com/opensearch-project/OpenSearch-Dashboards/pull/7172))
 - Break new lines in table cell in legacy discover ([#7207](https://github.com/opensearch-project/OpenSearch-Dashboards/pull/7207))
 - [Sample Data] Updates sample dashboard title in sample web logs data ([#7233](https://github.com/opensearch-project/OpenSearch-Dashboards/pull/7233))
 - Discover page status stuck in loading State ([#7252](https://github.com/opensearch-project/OpenSearch-Dashboards/pull/7252))
 - Unassign data source before deleteByWorkspace ([#7279](https://github.com/opensearch-project/OpenSearch-Dashboards/pull/7279))
 - Unused config setting and remove data sources as a required plugin. ([#7314](https://github.com/opensearch-project/OpenSearch-Dashboards/pull/7314))
 - Fix wrapping of labels in filter by type popover ([#7327](https://github.com/opensearch-project/OpenSearch-Dashboards/pull/7327))
 - [Navigation] Update dev tools tab css for new left navigation ([#7328](https://github.com/opensearch-project/OpenSearch-Dashboards/pull/7328))
 - Data source selector in dev tools tab moved to left ([#7347](https://github.com/opensearch-project/OpenSearch-Dashboards/pull/7347))
 - [navigation-next] Fix issues. ([#7356](https://github.com/opensearch-project/OpenSearch-Dashboards/pull/7356))
 - [DataSource] No restriction on setting default data source ([#7396](https://github.com/opensearch-project/OpenSearch-Dashboards/pull/7396))
 - Make breadcrumb of 4 new added applications comply with BrowserRouter. ([#7401](https://github.com/opensearch-project/OpenSearch-Dashboards/pull/7401))
 - [Bug][Workspace] Navigate to detail page when clicking all use case workspace ([#7405](https://github.com/opensearch-project/OpenSearch-Dashboards/pull/7405))
 - [Version Decoupling] Add data source version and installed plugins in data source viewer returns ([#7420](https://github.com/opensearch-project/OpenSearch-Dashboards/pull/7420))
 - [Bug][Workspace] Add permission validation at workspace detail page ([#7435](https://github.com/opensearch-project/OpenSearch-Dashboards/pull/7435))
 - [Bug][Data Source] Move data source manageable feature flag to DSM plugin ([#7440](https://github.com/opensearch-project/OpenSearch-Dashboards/pull/7440))
 - Update recent items icon from SVG to react component ([#7478](https://github.com/opensearch-project/OpenSearch-Dashboards/pull/7478))
 - [MDS] Fix the hide local cluster config ([#7497](https://github.com/opensearch-project/OpenSearch-Dashboards/pull/7497))
 - Update icon of recent items from OUI library to enable dark mode ([#7508](https://github.com/opensearch-project/OpenSearch-Dashboards/pull/7508))
 - Fix data source picker trigger local cluster call by default ([#7528](https://github.com/opensearch-project/OpenSearch-Dashboards/pull/7528))
 - Fix babel error ([#7541](https://github.com/opensearch-project/OpenSearch-Dashboards/pull/7541))
 - Fix tables not displaying in navigator and add local cluster to datasources ([#7542](https://github.com/opensearch-project/OpenSearch-Dashboards/pull/7542))
 - Fixes Discover next styling ([#7546](https://github.com/opensearch-project/OpenSearch-Dashboards/pull/7546))
 - [navigation]feat: redirect user to home in global when workspace is enabled ([#7551](https://github.com/opensearch-project/OpenSearch-Dashboards/pull/7551))
 - [Workspace]Add workspaces and permissions fields into saved objects _bulk_get response ([#7565](https://github.com/opensearch-project/OpenSearch-Dashboards/pull/7565))
 - Fixes databases not being displayed upon success ([#7567](https://github.com/opensearch-project/OpenSearch-Dashboards/pull/7567))

### 🚞 Infrastructure

### 📝 Documentation

 - Add zhyuanqi as maintainer ([#6788](https://github.com/opensearch-project/OpenSearch-Dashboards/pull/6788))
 - Move @BSFishy to emeritus maintainer ([#6790](https://github.com/opensearch-project/OpenSearch-Dashboards/pull/6790))
 - Add mengweieric as maintainer ([#6798](https://github.com/opensearch-project/OpenSearch-Dashboards/pull/6798))
 - Add OpenAPI specification for GET and CREATE saved object API ([#6799](https://github.com/opensearch-project/OpenSearch-Dashboards/pull/6799))
 - Add example for saved object creation part for openapi doc. ([#6855](https://github.com/opensearch-project/OpenSearch-Dashboards/pull/6855))
 - Add openAPI doc for saved_object find api ([#6856](https://github.com/opensearch-project/OpenSearch-Dashboards/pull/6856))
 - Add OpenAPI specification for bulk create and bulk update saved object APIs ([#6859](https://github.com/opensearch-project/OpenSearch-Dashboards/pull/6859))
 - Add OpenAPI specification for bulk_get saved object APIs ([#6860](https://github.com/opensearch-project/OpenSearch-Dashboards/pull/6860))
 - Add OpenAPI specification for update, delete and migrate saved object API ([#6864](https://github.com/opensearch-project/OpenSearch-Dashboards/pull/6864))
 - Add OpenAPI specification for import and export saved object api ([#6872](https://github.com/opensearch-project/OpenSearch-Dashboards/pull/6872))
 - Add OpenAPI specifications for resolve import errors api ([#6885](https://github.com/opensearch-project/OpenSearch-Dashboards/pull/6885))
 - Add Suchit as maintainer ([#6980](https://github.com/opensearch-project/OpenSearch-Dashboards/pull/6980))
 - Add Viraj as maintainer ([#7196](https://github.com/opensearch-project/OpenSearch-Dashboards/pull/7196))
 - Add OpenAPI specification for API for retrieving fields of index patterns ([#7270](https://github.com/opensearch-project/OpenSearch-Dashboards/pull/7270))
 - Add Sean as maintainer ([#7458](https://github.com/opensearch-project/OpenSearch-Dashboards/pull/7458))
 - Add Joshua as maintainer ([#7553](https://github.com/opensearch-project/OpenSearch-Dashboards/pull/7553))

### 🛠 Maintenance

 - Skip running tests for updates in CODEOWNERS ([#7197](https://github.com/opensearch-project/OpenSearch-Dashboards/pull/7197))

### 🪛 Refactoring

 - Unify getDefaultDataSourceId and export ([#6843](https://github.com/opensearch-project/OpenSearch-Dashboards/pull/6843))
 - [MDS] Refactor error handling in data source management plugin to use DataSourceError ([#6903](https://github.com/opensearch-project/OpenSearch-Dashboards/pull/6903))
 - [Look&Feel]  Refactor to use semantic headers for page, modal & flyout ([#7192](https://github.com/opensearch-project/OpenSearch-Dashboards/pull/7192))
 - [Look&Feel] Consistency of Plus Icons ([#7195](https://github.com/opensearch-project/OpenSearch-Dashboards/pull/7195))
 - [Look&Feel] Update Popover Padding Size ([#7200](https://github.com/opensearch-project/OpenSearch-Dashboards/pull/7200))
 - [Look&Feel] Replace browser tooltip usage with OUI tooltip ([#7231](https://github.com/opensearch-project/OpenSearch-Dashboards/pull/7231))
 - [Look&Feel] Use small EuiTabs and EuiTabbedContent across the board ([#7232](https://github.com/opensearch-project/OpenSearch-Dashboards/pull/7232))
 - Density and consistency changes for discover and query bar ([#7299](https://github.com/opensearch-project/OpenSearch-Dashboards/pull/7299))
 - [Look&Feel] Apply guidance for visBuilder ([#7341](https://github.com/opensearch-project/OpenSearch-Dashboards/pull/7341))
 - [Look&Feel] Apply small popover padding and add Oui tooltips ([#7523](https://github.com/opensearch-project/OpenSearch-Dashboards/pull/7523))
 - [Look&Feel] Discover and Query Management fix ([#7530](https://github.com/opensearch-project/OpenSearch-Dashboards/pull/7530))

### 🔩 Tests