import React, { Component } from 'react'
import PropTypes from 'prop-types'
import Helmet from 'react-helmet'
const axios = require('axios')
import Header from '../components/header'
import './index.css'
import Cookies from 'js-cookie'
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'

export const query = graphql`
  query SiteTitleQuery {
    site {
      siteMetadata {
        title
      }
    }
  }
`

export default class Layout extends Component {
  static propTypes = {
    children: PropTypes.func,
  }
  state = {
    token: null,
  }
  componentDidMount() {
    if (!Cookies.get('token')) {
      console.log('getting token')
      this.getToken()
    }
  }
  getToken = () => {
    axios
      .post(
        `${process.env.API_AUTH_URL}`,
        `grant_type=client_credentials&client_id=${
          process.env.API_CLIENT_ID
        }&client_secret=${process.env.API_CLIENT_SECRET}`
      )
      .then(res => {
        this.setState({ token: true })
        Cookies.set('token', res.data.access_token, { expires: 7 })
      })
      .catch(error => {
        console.log(error)
      })
  }

  render() {
    return (
      <MuiThemeProvider>
        <div>
          <Helmet
            title={this.props.data.site.siteMetadata.title}
            meta={[
              { name: 'description', content: 'Sample' },
              { name: 'keywords', content: 'sample, something' },
            ]}
          />
          <Header siteTitle={this.props.data.site.siteMetadata.title} />
          <div
            style={{
              margin: '0 auto',
              maxWidth: 960,
              padding: '0px 1.0875rem 1.45rem',
              paddingTop: 0,
            }}
          >
            {this.props.children()}
          </div>
        </div>
      </MuiThemeProvider>
    )
  }
}
