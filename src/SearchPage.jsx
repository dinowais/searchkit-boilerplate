import * as React from "react";
import * as _ from "lodash";
import {
  SearchkitManager,
  SearchkitProvider,
  SearchBox,
  RefinementListFilter,
  MenuFilter,
  Hits,
  HitsStats,
  NoHits,
  Pagination,
  SortingSelector,
  SelectedFilters,
  ResetFilters,
  ItemHistogramList,
  Layout,
  LayoutBody,
  LayoutResults,
  TopBar,
  SideBar,
  ActionBar,
  ActionBarRow
} from "searchkit";

require("./index.scss");

// const host = "http://demo.searchkit.co/api/movies"
const host = "http://127.0.0.1:9200/pubbuzz/pubmed/"
const searchkit = new SearchkitManager(host)

const MovieHitsGridItem = (props)=> {
  const {bemBlocks, result} = props
  console.log(props)
  // let url = "http://www.imdb.com/title/" + result._source.TITLE
  const source: any = _.extend({}, result._source, result.highlight)
  return (
    <div className={bemBlocks.item().mix(bemBlocks.container("item"))} data-qa="hit">
      <a href="#" target="_blank">
        <div data-qa="SOURCE" className={bemBlocks.item("SOURCE")} dangerouslySetInnerHTML={{__html: source.SOURCE}}>
        </div>
        <div data-qa="TITLE" className={bemBlocks.item("TITLE")} dangerouslySetInnerHTML={{__html: source.TITLE}}>
        </div>
      </a>
    </div>
  )
}

export class SearchPage extends React.Component {
  render() {
    return (
      <SearchkitProvider searchkit={searchkit}>
        <Layout>
          <TopBar>
            <SearchBox
              autofocus={true}
              searchOnChange={true}
              placeholder="Search ..."
              prefixQueryFields={["DRUG_FOUND", "SOURCE", "TITLE^10", "JOURNAL"]}/>
          </TopBar>
          <LayoutBody>
            <SideBar>
              <MenuFilter
                id="drug_found"
                title="Drug Found"
                field="DRUG_FOUND.raw"
                listComponent={ItemHistogramList}/>
              <RefinementListFilter
                id="JOURNAL"
                title="JOURNAL"
                field="JOURNAL.raw"
                operator="AND"
                size={10}/>
            </SideBar>
            <LayoutResults>
              <ActionBar>
                <ActionBarRow>
                  <HitsStats/>
                  <SortingSelector options={[
                    {label: "Relevance", field: "_score", order: "desc", defaultOption: true},
                    {label: "Latest Releases", field: "DATE_CREATED", order: "desc"},
                    {label: "Earliest Releases", field: "DATE_CREATED", order: "asc"}
                  ]}/>
                </ActionBarRow>
                <ActionBarRow>
                  <SelectedFilters/>
                  <ResetFilters/>
                </ActionBarRow>
              </ActionBar>
              <Hits mod="sk-hits-grid" hitsPerPage={10} itemComponent={MovieHitsGridItem}
                    sourceFilter={["TITLE", "SOURCE", "DATE_CREATED", "DRUG_FOUND", "JOURNAL"]}/>
              <NoHits/>
              <Pagination showNumbers={true}/>
            </LayoutResults>
          </LayoutBody>
        </Layout>
      </SearchkitProvider>
    )
  }
}
