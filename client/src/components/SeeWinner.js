import React, { Component } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import Card from "react-bootstrap/Card";

class SeeWinner extends Component {
  render() {
    return (
      <div className="Vote">
        <div style={{ display: "flex", justifyContent: "center" }}>
          <Card style={{ width: "50rem" }}>
            <Card.Header>
              <strong>Résultats</strong>
            </Card.Header>
            <Card.Body>
              <p>
                l'ID de la propositon est <b>{this.props.winningProposalId}</b>.
              </p>
              <p>
                La proposition est <b>{this.props.desc}</b>.
              </p>
              <p>
                Gagnante avec <b>{this.props.nbrVotes}</b> votes.
              </p>
            </Card.Body>
          </Card>
        </div>
      </div>
    );
  }
}

export default SeeWinner;
