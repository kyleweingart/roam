import React, { Component } from "react";
import SaveBtn from "../../components/SaveBtn";
import DeleteBtn from "../../components/DeleteBtn";
import Jumbotron from "../../components/Jumbotron";
import API from "../../utils/API";
import { Link } from "react-router-dom";
import { Col, Row, Container } from "../../components/Grid";
import { List, ListItem } from "../../components/List";
import { Input, FormBtn } from "../../components/Form";
import RoamMap from "../../components/Map/Map";
import "./Locations.css";

class Locations extends Component {
  state = {
    locations: [],
    category: "",
    savedLocations: [],
    currentLocation: {
      lat: "",
      long: ""
    }
  };

  componentDidMount() {
    this.loadSaved();
  }

  loadSaved = () => {
    API.getSaved().then(res => {
      this.setState({
        savedLocations: res.data
      });
      console.log(
        `\n****** This is the saved Locations data from mongo ******\n\n`
      );
      this.state.savedLocations.forEach(element => {
        console.log(element);
      });
    });
  };

  loadLocations = () => {
    API.getLocations()
      .then(res => {
        this.setState({
          locations: res
        });
      })
      .catch(err => console.log(err));
  };

  deleteLocation = id => {
    API.deleteLocations(id)
      .then(res => this.loadSaved())
      .catch(err => console.log(err));
  };

  saveLocation = locationData => {
    API.saveLocation(locationData)
      .then(res => this.loadSaved())
      .catch(err => console.log(err));
  };

  handleInputChange = event => {
    const { name, value } = event.target;
    this.setState({
      [name]: value
    });
  };

  handleFormSubmit = event => {
    event.preventDefault();
    API.getLocations(this.state.category)
      // come back to this with proper dot notation for YELP response \/ \/ \/ \/ \/ \/ \/ \/ \/ \/ \/ \/ \/ \/ \/ \/ \/ \/
      .then(response => {
        const cleanResponse = JSON.stringify(
          response.data.jsonBody.businesses,
          null,
          4
        );
        this.setState({ locations: response.data.jsonBody.businesses });
        console.log(`\n\n${cleanResponse}\n\n`);
      })
      .catch(e => {
        console.log(e);
      });
  };

  render() {
    return (
      <Container fluid>
        <Row>
          <Col size="md-12">
            <div id="map-block">
              <RoamMap />
            </div>
            <form>
              <Input
                value={this.state.subject}
                onChange={this.handleInputChange}
                name="category"
                placeholder="Location Category"
              />
              <FormBtn
                disabled={!this.state.category}
                onClick={this.handleFormSubmit}
              >
                Search
              </FormBtn>
            </form>
          </Col>
        </Row>
        <Row>
          <Col size="lg-6">
            <div className="card">
              <div className="card-header">
                <h4>Search Results</h4>
              </div>
              <div className="card-body">
                {this.state.locations.length ? (
                  <List>
                    {this.state.locations.map(location => (
                      <ListItem key={location.id}>
                        <a href={location.url}>
                          <strong>{location.name}</strong>
                        </a>
                        <SaveBtn
                          onClick={() => {
                            this.saveLocation({
                              name: location.name,
                              location: {
                                lat: location.coordinates.latitude,
                                long: location.coordinates.longitude
                              },
                              url: location.url
                            });
                            console.log({
                              name: location.name,
                              location: {
                                lat: location.coordinates.latitude,
                                long: location.coordinates.longitude
                              },
                              url: location.url
                            });
                          }}
                        />
                      </ListItem>
                    ))}
                  </List>
                ) : (
                  <h5 className="text-center">No Results to Display</h5>
                )}
              </div>
            </div>
          </Col>
          {/* </Row>
                <Row> */}
          <Col size="lg-6">
            <div className="card">
              <div className="card-header">
                <h4>Saved Locations</h4>
              </div>
              <div className="card-body">
                {this.state.savedLocations.length ? (
                  <List>
                    {this.state.savedLocations.map(location => (
                      <ListItem key={location.id}>
                        <a href={location.url}>
                          <strong>{location.name}</strong>
                        </a>
                        <DeleteBtn
                          onClick={() => this.deleteLocation(location.id)}
                        />
                      </ListItem>
                    ))}
                  </List>
                ) : (
                  <h5 className="text-center">No Saved Locations</h5>
                )}
              </div>
            </div>
          </Col>
        </Row>
      </Container>
    );
  }
}

export default Locations;