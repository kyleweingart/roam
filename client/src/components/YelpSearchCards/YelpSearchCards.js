import React, { Component } from "react";
import SaveBtn from "../SaveBtn";
import { Col, Row, Container } from "../Grid";
import { List, ListItem } from "../List";
import "./YelpSearchCards.css";

class YelpSearchCards extends Component {
  render() {
    return (
      <Container fluid>
        <Row>
          <Col size="sm-12">
            <div className="card">
              <div className="card-body">
                {this.props.locations.length ? (
                  <List>
                    {this.props.locations.map((location, index) => (
                      <ListItem key={`${location.id}-${index}`}>
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
                              url: location.url,
                              user: this.props.loggedInAs
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
        </Row>
      </Container>
    );
  }
}

export default YelpSearchCards;