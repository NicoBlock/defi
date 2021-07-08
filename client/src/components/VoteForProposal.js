import React, { Component } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Card from "react-bootstrap/Card";

class VoteForProposal extends Component {
  generateVote = (event) => {
    event.preventDefault();
    const proposalID = this.proposalID.value;
    this.props.voteForProposal(proposalID);
    this.proposalID.value = "";
  };

  render() {
    const owner = this.props.owner;
    const user = this.props.user;
    return (
      <div className="Vote">
        <div style={{ display: "flex", justifyContent: "center" }}>
          <Card style={{ width: "50rem" }}>
            <Card.Header>
              <strong>Votez pour une proposition</strong>
            </Card.Header>
            <Card.Body>
              <Form.Group>
                <Form.Control
                  type="text"
                  id="proposalID"
                  placeholder="ID de la proposition"
                  ref={(input) => {
                    this.proposalID = input;
                  }}
                />
              </Form.Group>
              <Button onClick={this.generateVote} variant="primary">
                Voter
              </Button>
            </Card.Body>
          </Card>
        </div>
        <br></br>

        <div style={{ display: "flex", justifyContent: "center" }}>
          <Card style={{ width: "50rem" }}>
            <Card.Header>
              <strong>Passer au comptage des votes</strong>
            </Card.Header>
            <Card.Body>
              {user === owner ? (
                <Button
                  onClick={this.props.closeVoteSession}
                  variant="danger"
                  block
                >
                  Terminer la session de votes
                </Button>
              ) : (
                <Button
                  onClick={this.props.closeVoteSession}
                  variant="danger"
                  block
                  disabled
                >
                  Terminer la session de votes
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

export default VoteForProposal;
