import React, { Component } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";

class OpenVoteSession extends Component {
  render() {
    const owner = this.props.owner;
    const user = this.props.user;
    return (
      <div className="Vote">
        <div style={{ display: "flex", justifyContent: "center" }}>
          <Card style={{ width: "50rem" }}>
            <Card.Header>
              <strong>Prochaine session : Votes</strong>
            </Card.Header>
            <Card.Body>
              <p>
                Les envois de propositions sont terminés.<br></br>
                Veuillez attendre que l'administrateur ouvre la session de
                votes.
              </p>
              {user === owner ? (
                <Button
                  onClick={this.props.openVoteSession}
                  variant="warning"
                  block
                >
                  Ouvrir la session de votes
                </Button>
              ) : (
                <Button
                  onClick={this.props.openVoteSession}
                  variant="warning"
                  block
                  disabled
                >
                  Ouvrir la session de votes
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

export default OpenVoteSession;
