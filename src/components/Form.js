import React from 'react';

const Form = () => {
  constructor() {
    super();
    this.state = {
      year: ['2022', '2021', '2020', '2019', '2018', '2017', '2016', '2015', '2014', '2013', '2012', '2011', '2010', '2009', '2008', '2007', '2006', '2005', '2004', '2003', '2002', '2001', '2000', '1999', '1998', '1997', '1996', '1995', '1994', '1993', '1992', '1991', '1990', '1989', '1988', '1987', '1986', '1985', '1984'],
      selectedYear: null,
      make: null,
      selectedMake: null,
      model: null,
      selectedModel: null,
      vehicle: null,
      miles: null,
      carbonFootprint: null,
      error: null
    }
  }

  render() {
    return (
      <div>
        <form>
        <button disabled={this.state.selectedVehicleID === null}>Submit</button>
        </form>
        <div>
          <p>Miles/year: {this.state.miles}</p>
          <p>Miles per gallon (MPG): {this.state.avgMPG ? this.state.avgMPG : null}</p>
          <p>Carbon Footprint: {this.state.carbonFootprint ? this.state.carbonFootprint + 'g CO2' : null}</p>
        </div>
      </div>
    );
  }
};

export default Form;
