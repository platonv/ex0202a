import axios from 'axios'

class RequestService {
  constructor() {
    this.config = {
      apiPath: 'http://localhost:4021',

      globalConfig: {
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
      },
    }
  }
  get(url) {
    return this._request(url, 'GET')
  }

  post(url, body) {
    return this._request(url, 'POST', body || {})
  }

  put(url, body) {
    return this._request(url, 'PUT', body)
  }

  delete(url, body) {
    return this._request(url, 'DELETE', body)
  }

  _request(url, method, body) {
    const options = {
      method: method,
      headers: this.config.globalConfig.headers,
      data: JSON.stringify(body),
    }

    let full_path = this.config.apiPath + url

    return new Promise((resolve, reject) => {
      axios(full_path, options)
        .then(response => {
          console.log(response)
          resolve(response.data)
        })
        .catch(err => {
          console.log(err)
          reject(err)
        })
    })
  }
}

export default new RequestService()
