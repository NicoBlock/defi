import React, { Component } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Card from "react-bootstrap/Card";

class RegisterVoters extends Component {
  createVoter = (event) => {
    event.preventDefault();
    const address = this.address.value;
    this.props.registerToVote(address);
    this.address.value = "";
  };

  render() {
    const owner = this.props.owner;
    const user = this.props.user;
    return (
      <div className="Vote">
        <div style={{ display: "flex", justifyContent: "center" }}>
          <Card style={{ width: "50rem" }}>
            <Card.Header>
              <strong>Ajout de comptes pour propositions et votes</strong>
            </Card.Header>
            <Card.Body>
              <p>L'enregistrement des propositions n'est pas encore ouvert.</p>
              <p>Veuillez attendre que les autorisations soient données.</p>
              <Form.Group>
                <Form.Control
                  type="text"
                  id="address"
                  placeholder="Adresse à autoriser"
                  ref={(input) => {
                    this.address = input;
                  }}
                />
              </Form.Group>
              <Button onClick={this.createVoter} variant="primary">
                Autoriser
              </Button>
            </Card.Body>
          </Card>
        </div>
        <br></br>
        <div style={{ display: "flex", justifyContent: "center" }}>
          <Card style={{ width: "50rem" }}>
            <Card.Header>
              <strong>
                Passer à la session d'enregistrement des propositions
              </strong>
            </Card.Header>
            <Card.Body>
              {user === owner ? (
                <Button
                  onClick={this.props.openProposalRegistration}
                  variant="danger"
                  block
                >
                  Ouvrir la session d'enregistrement de propositions
                </Button>
              ) : (
                <Button
                  onClick={this.props.openProposalRegistration}
                  variant="danger"
                  block
                  disabled
                >
                  Ouvrir la session d'enregistrement de propositions
                </Button>
              )}
            </Card.Body>
          </Card>
        </div>
        <br></br>
      </div>
    );
  }
}

export default RegisterVoters;
