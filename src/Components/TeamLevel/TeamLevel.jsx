import React from "react";
import "./TeamLevel.css";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import Typography from "@mui/material/Typography";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import TeamMemberTable from "../TeamMembersTable/TeamMemberTable";

const TeamLevel = ({level, team}) => {
  return (
    <div className="team-level-outer-container">
      <Accordion>
        <AccordionSummary
          expandIcon={<ArrowDropDownIcon />}
          aria-controls="panel2-content"
          id="panel2-header"
        >
          <Typography>Level {level} {level==1 && '(Direct Team Members)'}</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <TeamMemberTable team={team}></TeamMemberTable>
        </AccordionDetails>
      </Accordion>
    </div>
  );
};

export default TeamLevel;
