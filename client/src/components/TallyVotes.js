import React, { Component } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";

class TallyVotes extends Component {
  render() {
    const owner = this.props.owner;
    const user = this.props.user;
    return (
      <div className="Vote">
        <div style={{ display: "flex", justifyContent: "center" }}>
          <Card style={{ width: "50rem" }}>
            <Card.Header>
              <strong>Comptage des votes</strong>
            </Card.Header>
            <Card.Body>
              <p>La session de vote est terminée.</p>
              <p>
                Veuillez attendre que l'administrateur définisse la proposition
                remportant le plus de votes.
              </p>
              {user === owner ? (
                <Button onClick={this.props.countVotes} variant="danger" block>
                  Compatabiliser les votes
                </Button>
              ) : (
                <Button
                  onClick={this.props.countVotes}
                  variant="danger"
                  block
                  disabled
                >
                  Comptabiliser les votes
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

export default TallyVotes;
