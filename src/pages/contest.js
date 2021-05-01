import React from "react"
import axios from "axios";
import { toast } from 'react-toastify';
import { connect } from 'react-redux'
import Grid from '@material-ui/core/Grid';

import Layout from "../components/layout/layout"
import { fetchContest } from "../actions/contestActions"
import DismissableAlert from "../components/dismissableAlert"
import {isPastEndDate } from "../util/dateCompare"
import ContestSubmissionsCard from "../components/competition/contestSubmissionsCard"
//import ContestFundingCard from "../components/competition/contestFundingCard"
import ItemizedFundingCard from "../components/competition/itemizedFundingCard"
import ContestShareCard from "../components/competition/contestShareCard"
import CompetitionText from "../components/competition/competitionText"
import GoalRing from "../components/legislation/goalRing"
import { CONTEST_DATA_URL } from "../constants"


class ContestPage extends React.Component {

  constructor(props) {
    super(props)
    this.state = {legislationList: []}
  }

  componentDidMount() {
    this.props.dispatch(fetchContest(this.props.match.params.id))
    //this.props.dispatch(fetchLegislationByContest(this.props.match.params.id))
    axios.get(CONTEST_DATA_URL + "/" + this.props.match.params.id + "/legislation")
      .then(res => {
        const legislationList = res.data;
        this.setState({...this.state, legislationList});
      }).catch(function (error) {
        toast.error("Unable to load legislation, plese try again in a few minutes");
      })
  }

  render() {
    var contest = this.props.contest
    var alert;

    if (contest) {
      var pastEndDate = isPastEndDate(contest.endDate)
      if (pastEndDate && !!contest.legislatureLink) {
        alert =
        <DismissableAlert variant="turq" heading="This Issue Has Been Closed!">
          <p className="mb-2"> The winning legislation is making it's way through the legislature now!  </p>
          <p className="my-0"> Check it out here: <a target="_blank" rel="noopener noreferrer" href={contest.legislatureLink}>{contest.legislatureLink}</a></p>
        </DismissableAlert>
      } else if (pastEndDate) {
        alert =
        <DismissableAlert variant="turq" heading="This Issue Has Been Closed!">
          <p className="mb-2"> The winning legislation is still being selected</p> </DismissableAlert>
      } else {
        alert = null
      }
    }

    return (
      <Layout>
        {contest ?
          <Grid container justify="center" direction="column" style={{padding:20}}>
            <Grid item>
              {alert}
            </Grid>
            <Grid container justify="center" spacing={5}>
                <Grid item xs={12} md={8} >
                  <CompetitionText
                    title={contest.title}
                    prizes={contest.prize}
                    description={contest.description}
                    rules={contest.rules}
                    criteria={contest.criteria}
                    endDate={contest.endDate}
                  />
                </Grid>
                <Grid container item xs={12} md={4} style={{padding:34}}>
                  <Grid container item direction="column" spacing={5}>
                    <Grid container justify="center" align="center">
                      <Grid item xs={4}>
                        <GoalRing currentFunding={contest.prize}/>
                      </Grid>
                    </Grid>
                    <Grid item>
                      <ItemizedFundingCard currentFunding={contest.prize} contestId={contest.id}/>
                    </Grid>
                    <Grid item>
                      <ContestShareCard />
                    </Grid>
                    <Grid item>
                      <ContestSubmissionsCard contest={contest} legislationList={this.state.legislationList} />
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          : <></>
        }
      </Layout>
    )
  }
}

function mapStateToProps(state) {

  var { contest } = state
  contest = contest.contest

  return {
    contest
  }
}

export default connect(mapStateToProps)(ContestPage)
