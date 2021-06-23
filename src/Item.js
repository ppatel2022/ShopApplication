import React, { Component } from "react";
import logo from "./react.svg";
import { Link, NavLink } from "react-router-dom";
import Header from "./Header";
const axios = require("axios");

class Item extends React.Component {
  static async getInitialProps({ req, res, match }) {
    if (!process.browser) {
      let dataSet = [];
      try {
        const response = await axios(process.env.DATA_SOURCE);

        let item = response.data.filter((o) => o.id == match.params.item_id);
        if (item) {
          item = item[0];
        }
        return {
          item: item,
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
    this.handleSubmit = this.handleSubmit.bind(this);
    this.state = {
      endoint:
        "https://app.konimbo.co.il/api/v2?storeId=5596&token=f6666e751b7fbe2cd5167fec753318469dea6caa161558c1d8a77b2369e3809b361b3003784c7346&groupName=group1&modelName=item",
      loader: true,
      form_submited: false,
      item: this.props.item || false,
      contact_endpoint: "https://webhook.site",
    };
  }

  componentDidMount() {}

  componentWillMount() {
    if (!this.props.item) {
      var that = this;
      fetch(that.state.endoint)
        .then((resp) => resp.json())
        .then(function (data) {
          that.setState(
            {
              dataSet: data,
            },
            () => {
              let item = that.state.dataSet.filter(
                (o) => o.id == that.props.match.params.item_id
              );
              if (item) {
                that.setState({
                  item: item[0],
                  loader: false,
                });
              }
            }
          );
        })
        .catch(function (data) {});
    } else {
      this.setState({
        loader: false,
      });
    }
  }

  componentDidUpdate(prevProps) {}

  handleSubmit(event) {
    var that = this;
    event.preventDefault();
    fetch(this.state.contact_endpoint, {
      method: "POST",
      body: new FormData(event.target),
    })
      .then(function (response) {
        that.setState({ form_submited: true });
        if (response.ok) {
          return response.json();
        }
        return Promise.reject(response);
      })
      .then(function (data) {
        console.log(data);
      })
      .catch(function (error) {
        that.setState({ form_submited: true });
        console.warn(error);
      });
  }

  render() {
    return (
      <>
        <Header />

        {this.state.loader && <div className={"please-wait"}> אנא המתן..</div>}

        {this.state.item && (
          <>
            <div className={"item-wrapper"}>
              <h2>{this.state.item.title}</h2>
              <img
                src={this.state.item.image.url}
                alt={this.state.item.title}
              />
              <div className={"item-description"}>
                <span className="item-excerpt-item-page">
                  {(this.state.item.store_category_parent &&
                    this.state.item.store_category_parent.seo_description) ||
                    (this.state.item.store_category_parent &&
                      this.state.item.store_category_parent.title_he)}
                </span>
                <span className="item-pricet-item-page">
                  {this.state.item.price} &#8362;
                </span>
              </div>
            </div>

            <form className={"leave-details"} onSubmit={this.handleSubmit}>
              {this.state.form_submited && (
                <small>תודה רבה, נחזור אלייכם תוך יום עסקים אחד!</small>
              )}

              {!this.state.form_submited && (
                <>
                  <small>מעוניינים במוצר? השאירו פרטים ונחזור אלייכם!</small>
                  <input
                    className={"leave-details-input"}
                    type="text"
                    name={"name"}
                    placeholder={"שם"}
                    required
                  />
                  <input
                    className={"leave-details-input"}
                    type="email"
                    name={"email"}
                    placeholder={"אימייל"}
                    required
                  />
                  <input
                    className={"leave-details-input"}
                    type="number"
                    name={"phone"}
                    placeholder={"טלפון"}
                    required
                  />
                  <input type="submit" value="שלח פרטים!" />
                </>
              )}
            </form>
          </>
        )}
      </>
    );
  }
}

export default Item;
