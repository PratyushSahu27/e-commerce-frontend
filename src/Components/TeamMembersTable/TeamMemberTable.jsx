import React, { useState } from "react";
import "./TeamMemberTable.css";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";

const TeamMemberTable = ({ team }) => {

  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 400 }} size="small" aria-label="a dense table">
        <TableHead>
          <TableRow>
            <TableCell align="center">Name</TableCell>
            <TableCell align="center">SM ID</TableCell>
            <TableCell align="center">Guide ID</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {team.length > 0 && team.map((user) => (
            <TableRow
              key={user.smId}
              sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
            >
              <TableCell align="center">{user.name}</TableCell>
              <TableCell align="center">{user.smId}</TableCell>
              <TableCell align="center">{user.guideId}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default TeamMemberTable;
