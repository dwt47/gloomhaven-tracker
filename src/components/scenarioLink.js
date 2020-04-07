import React from "react"
import PropTypes from "prop-types"
import { Link } from "gatsby"

const ScenarioLink = ({ scenario: { path, title, scenarioID } }) => (
  <Link to={path}>
    {scenarioID} {title}
  </Link>
)

ScenarioLink.propTypes = {
  scenario: PropTypes.shape({
    path: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    scenarioID: PropTypes.number,
  }).isRequired,
}

export default ScenarioLink
