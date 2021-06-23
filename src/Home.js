import React, { Component } from "react";
import logo from "./react.svg";
import { Link, NavLink } from "react-router-dom";
import { chunk } from "lodash";
const axios = require("axios");
import Header from "./Header";

class Home extends React.Component {
  static async getInitialProps({ req, res, match }) {
    if (!process.browser) {
      let dataSet = [];
      try {
        const response = await axios(process.env.DATA_SOURCE);
        const chunkSize = 9;
        const arrayFromObject = Object.entries(response.data).map(
          ([key, value]) => value
        );
        const chunks = chunk(arrayFromObject, chunkSize);
        let categories = ["קטגוריות"];

        response.data.forEach(function (item, key) {
          if (
            item.store_category.group_title &&
            !categories.includes(item.store_category.group_title)
          ) {
            categories.push(item.store_category.group_title);
          }
        });

        return {
          dataSetChunks: chunks,
          categories: categories,
        };
      } catch (e) {
        console.error(`ERROR : ${e}`);
        //notify to stdout &    than error page
        return { statusCode: 302, redirectTo: "/notFound" };
      }
    }
  }

  constructor(props) {
    super(props);
    let page_index = props.match.params.page_index || 0;
    this.state = {
      dataSetChunks: this.props.dataSetChunks,
      showByChunks: true,
      page_index: page_index,
      categories: this.props.categories,
      selected_category: false,
      serch_results: [],
    };
  }

  componentDidMount() {
    if (!this.props.dataSetChunks) {
      this.setState((prevState) => {
        prevState = JSON.parse(localStorage.getItem("temp_state"));
        return prevState;
      });
    } else {
      localStorage.setItem("temp_state", JSON.stringify(this.state));
    }
  }

  handleChange = (event) => {
    let category = event.target.value;
    let result = [];
    if (category === "קטגוריות") {
      category = false;
    }

    this.state.dataSetChunks.forEach(function (chunk, index) {
      chunk.forEach(function (item, key) {
        if (item.store_category.group_title === category) {
          result.push(item);
        }
      });
    });

    this.setState({
      selected_category: category,
      serch_results: result,
      showByChunks: false,
    });
  };

  handleClick = (e) => {
    let results = [];
    let search_for = document.querySelector("#site-search").value;
    if (!search_for) {
      return false;
    }

    this.state.dataSetChunks.forEach(function (chunk, index) {
      let items = chunk.filter((o) => o.title.includes(search_for));
      results = [...results, ...items];
    });

    this.setState({
      search_by_keyword: true,
      serch_results: results,
      showByChunks: false,
    });
  };

  componentDidCatch(error, info) {
    this.setState({ error: true });
  }

  render() {
    var that = this;
    if (this.state.error) {
      return <div>אירעה שגיאה</div>;
    }

    if (!this.state.dataSetChunks) {
      return null;
    }
    return (
      <>
        <Header />
        <div className={"main-wrapper"}>
          <div className="container tools-bar">
            <div className={"open-search"}>
              <button onClick={this.handleClick.bind(this)}>חיפוש</button>
              <input type="text" id="site-search" placeholder={"חיפוש חופשי"} />
            </div>

            <div className={"categories-selector"}>
              <select onChange={this.handleChange} value={this.state.value}>
                {this.state.categories.map(function (item, index) {
                  return (
                    <option key={index} value={item}>
                      {item}
                    </option>
                  );
                })}
              </select>
            </div>
          </div>
          <div className="container">
            <div className="grid-row">
              {!this.state.showByChunks && (
                <>
                  {this.state.serch_results.map(function (item, index) {
                    return <ItemBlock key={item.id} item={item} />;
                  })}
                </>
              )}

              {!this.state.selected_category && (
                <>
                  <div className={"pageing-wrapper center"}>
                    <span
                      onClick={function (e) {
                        if (
                          that.state.page_index ===
                          that.state.dataSetChunks.length
                        ) {
                          return false;
                        }
                        that.setState({
                          page_index: that.state.page_index + 1,
                        });
                      }}
                    >
                      הבא
                    </span>

                    <span>
                      &nbsp; דף &nbsp;
                      {that.state.page_index + 1}
                      &nbsp; מתוך &nbsp;
                      {that.state.dataSetChunks.length}
                    </span>

                    <span
                      onClick={function (e) {
                        if (that.state.page_index === 0) {
                          return false;
                        }
                        that.setState({
                          page_index: that.state.page_index - 1,
                        });
                      }}
                    >
                      הקודם
                    </span>
                  </div>

                  {this.state.dataSetChunks[that.state.page_index].map(
                    function (item, index) {
                      return <ItemBlock key={item.id} item={item} />;
                    }
                  )}

                  <div className={"pageing-wrapper center"}>
                    <span
                      onClick={function (e) {
                        if (
                          that.state.page_index ===
                          that.state.dataSetChunks.length
                        ) {
                          return false;
                        }
                        that.setState({
                          page_index: that.state.page_index + 1,
                        });
                      }}
                    >
                      הבא
                    </span>

                    <span>
                      &nbsp; דף &nbsp;
                      {that.state.page_index + 1}
                      &nbsp; מתוך &nbsp;
                      {that.state.dataSetChunks.length}
                    </span>

                    <span
                      onClick={function (e) {
                        if (that.state.page_index === 0) {
                          return false;
                        }
                        that.setState({
                          page_index: that.state.page_index - 1,
                        });
                      }}
                    >
                      הקודם
                    </span>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </>
    );
  }
}

class ItemBlock extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      item: this.props.item,
      index: this.props.index,
    };
  }
  render() {
    return (
      <div className="grid-item">
        <div className="grid-item-wrapper">
          <div className="grid-item-container">
            <div className="grid-image-top">
              <div
                className="centered image-bg"
                style={{ backgroundImage: `url(${this.state.item.image.url})` }}
              ></div>
            </div>
            <div className="grid-item-content">
              <span className="item-title">{this.state.item.title}</span>
              <span className="item-category center">
                {this.state.item.store_category.group_title}
              </span>
              <span className="item-excerpt center">
                {(this.state.item.store_category_parent &&
                  this.state.item.store_category_parent.seo_description) ||
                  (this.state.item.store_category_parent &&
                    this.state.item.store_category_parent.title_he)}
              </span>
              <span className="item-price">
                {this.state.item.price} &#8362;
              </span>
            </div>
            <NavLink className="more-info" to={`/item/${this.state.item.id}`}>
              פרטים נוספים..
            </NavLink>
          </div>
        </div>
      </div>
    );
  }
}

export default Home;
