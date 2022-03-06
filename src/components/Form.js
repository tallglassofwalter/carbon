import React from 'react';

class Form extends React.Component {
  constructor() {
    super();
    this.state = {
      year: ['2023', '2022', '2021', '2020', '2019', '2018', '2017', '2016', '2015', '2014', '2013', '2012', '2011', '2010', '2009', '2008', '2007', '2006', '2005', '2004', '2003', '2002', '2001', '2000', '1999', '1998', '1997', '1996', '1995', '1994', '1993', '1992', '1991', '1990', '1989', '1988', '1987', '1986', '1985', '1984'],
      selectedYear: null,
      make: null,
      selectedMake: null,
      model: null,
      selectedModel: null,
      options: null,
      selectedOption: null,
      avgMPG: null,
      miles: null,
      carbonFootprint: null,
      error: null
    }
  }

  handleErrors(res) {
    if (res.statusText === 'No Content') {
      return Promise.reject({
        code: res.status,
        message: res.statusText
      });
    } else {
      return res.text();
    }
  }

  handleChange(el, e) {
    if (e.target.value) {
      if (el === 'year') {
        const year = e.target.value;
        return fetch(`https://www.fueleconomy.gov/ws/rest/vehicle/menu/make?year=${year}`, { method: 'GET' })
          .then((res) => this.handleErrors(res))
          .then((res) => {
            const data = new DOMParser().parseFromString(res, 'application/xml');
            const make = [];

            data.childNodes[0].childNodes.forEach((node) => {
              make.push(node.childNodes[0].innerHTML);
            });

            this.setState({
              selectedYear: year,
              make,
              selectedMake: null,
              model: null,
              selectedModel: null,
              options: null,
              selectedOption: null,
              avgMPG: null,
              miles: null,
              carbonFootprint: null,
              error: null
            });
          })
          .catch((err) => {
            console.error(err);
            this.setState({ error: 'This selection did not return any data.' });
          })
      } else if (el === 'make') {
        const make = e.target.value;
        return fetch(`https://fueleconomy.gov/ws/rest/vehicle/menu/model?year=${this.state.selectedYear}&make=${make}`, { method: 'GET' })
          .then((res) => this.handleErrors(res))
          .then((res) => {
            const data = new DOMParser().parseFromString(res, 'application/xml');
            const model = [];

            data.childNodes[0].childNodes.forEach((node) => {
              model.push(node.childNodes[0].innerHTML);
            });

            this.setState({
              selectedMake: make,
              model: null,
              selectedModel: null,
              options: null,
              selectedOption: null,
              avgMPG: null,
              miles: null,
              carbonFootprint: null,
              error: null
            });
          })
          .catch((err) => {
            console.error(err);
            this.setState({ error: 'This selection did not return any data.' });
          })
      } else if (el === 'model') {
        const model = e.target.value;
        return fetch(`https://fueleconomy.gov/ws/rest/vehicle/menu/options?year=${this.state.selectedYear}&make=${this.state.selectedMake}&model=${model}`, { method: 'GET' })
          .then((res) => this.handleErrors(res))
          .then((res) => {
            const data = new DOMParser().parseFromString(res, 'application/xml');
            const options = [];
            data.childNodes[0].childNodes.forEach((node) => {
              let obj = {};
              let id = node.childNodes[1].innerHTML;
              obj[node.childNodes[0].innerHTML] = id;
              options.push(obj);
            });

            this.setState({
              selectedModel: model,
              options: null,
              selectedOption: null,
              avgMPG: null,
              miles: null,
              carbonFootprint: null,
              error: null
            });
          })
          .catch((err) => {
            console.error(err);
            this.setState({ error: 'This selection did not return any data.' });
          })
        } else if (el === 'options') {
          const vehicle = e.target.value;
          
          return fetch(`https://fueleconomy.gov/ws/rest/ympg/shared/ympgVehicle/${vehicle}`, { method: 'GET' })
            .then((res) => this.handleErrors(res))
            .then((res) => {
              const data = new DOMParser().parseFromString(res, 'application/xml');
              const avgMPG = data.childNodes[0].childNodes[0].innerHTML;
  
              this.setState({
                selectedOption: vehicle,
                avgMPG,
                miles: null,
                carbonFootprint: null,
                error: null
              });
            })
            .catch((err) => {
              console.error(err);
              this.setState({ error: 'This selection did not return any data.' });
            })
      } else if (el === 'miles-driven') {
        this.setState({ miles: e.target.value })
      }
    }

  }

  handleSubmit(e) {
    e.preventDefault();
    let carbon = (this.state.miles / this.state.avgMPG) * 8887;
    carbon = carbon.toFixed(2);
    this.setState({ carbonFootprint: carbon });
  }

  render() {
    return (
      <div>
        <form onSubmit={(e) => this.handleSubmit(e)}>
          <h2>Calculate Carbon Footprint</h2>
          <div className="form__error">{this.state.error}</div>
          <fieldset>
            <p>To calculate a vehicle's carbon footprint, enter the information below and click 'Submit.'</p>

            <div className="form__select">
              <label htmlFor="miles-driven">miles/year: </label>
              <input
                id="miles-driven"
                type="number"
                min="0"
                onChange={(e) => this.handleChange('miles-driven', e)}
                required
              />
            </div>

            {
              ['year', 'make', 'model'].map((el) => {
                return (
                  <div className="form__select" key={el}>
                    <label htmlFor={el}>{el}: </label>
                    <select
                      name={el}
                      id={el}
                      disabled={this.state[el] === null}
                      onChange={(e) => this.handleChange(el,e)}
                      defaultValue=""
                    >
                      <option value="">-- Select -- </option>
                      {
                        this.state[el] === null ? null : this.state[el].map((item) => {
                          return <option key={item} value={item}>{item}</option>
                        })
                      }
                    </select>
                  </div>
                )
              })
            }

            <div className="form__select">
              <label htmlFor='options'>options: </label>
              <select
                name='options'
                id='options'
                disabled={this.state.options === null}
                onChange={(e) => this.handleChange('options', e)}
                defaultValue=""
              >
                <option value="">-- Select -- </option>
                {
                  this.state.options === null ? null : this.state.options.map((item) => {
                    return <option key={Object.keys(item)[0]} value={Object.values(item)[0]}>{Object.keys(item)[0]}</option>
                  })
                }
              </select>
            </div>
            
          </fieldset>
          <button disabled={this.state.selectedOption === null}>Submit</button>
        </form>
        <div>
          <p>Miles/year: {this.state.miles}</p>
          <p>Miles per gallon (MPG): {this.state.avgMPG ? this.state.avgMPG : null}</p>
          <p>Carbon Footprint: {this.state.carbonFootprint ? this.state.carbonFootprint + 'g CO2 per year' : null}</p>
        </div>
      </div>
    );
  }
};

export default Form;
