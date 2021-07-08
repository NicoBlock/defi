import React, { Component } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Card from "react-bootstrap/Card";

class SendProposal extends Component {
  createProposition = (event) => {
    event.preventDefault();
    const description = this.description.value;
    this.props.sendProposition(description);
    this.description.value = "";
  };

  render() {
    const owner = this.props.owner;
    const user = this.props.user;
    return (
      <div className="Vote">
        <div style={{ display: "flex", justifyContent: "center" }}>
          <Card style={{ width: "50rem" }}>
            <Card.Header>
              <strong>Enregistrement de proposition</strong>
            </Card.Header>
            <Card.Body>
              <Form.Group>
                <Form.Control
                  type="text"
                  id="description"
                  placeholder="Saisissez votre proposition"
                  ref={(input) => {
                    this.description = input;
                  }}
                />
              </Form.Group>
              <Button onClick={this.createProposition} variant="primary">
                Envoyer
              </Button>
            </Card.Body>
          </Card>
        </div>
        <br></br>

        <div style={{ display: "flex", justifyContent: "center" }}>
          <Card style={{ width: "50rem" }}>
            <Card.Header>
              <strong>Passer à la session de votes</strong>
            </Card.Header>
            <Card.Body>
              {user === owner ? (
                <Button
                  onClick={this.props.closeProposalRegistration}
                  variant="danger"
                  block
                >
                  Fermer la session d'enregistrement de propositions
                </Button>
              ) : (
                <Button
                  onClick={this.props.closeProposalRegistration}
                  variant="danger"
                  block
                  disabled
                >
                  Fermer la session d'enregistrement de propositions
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

export default SendProposal;
