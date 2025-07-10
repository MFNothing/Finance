import React from "react";
import { Stack, Typography, Paper } from "@mui/material";

interface CompanyTitleCardProps {
  companyName: string;
  companyCode: string;
}

const CompanyTitleCard: React.FC<CompanyTitleCardProps> = ({ companyName, companyCode }) => {
  return (
    <Paper sx={{ p: 2 }} variant="outlined">
      <Stack direction="row" spacing={'6px'}>
        <Typography sx={{ marginLeft: "3px", fontWeight: 600, lineHeight: '19px' }} variant="h6">
          {companyName}
        </Typography>
        <Typography sx={{ fontWeight: 600, lineHeight: '19px' }} variant="h6">
          ({companyCode})
        </Typography>
      </Stack>
    </Paper>
  );
};

export default CompanyTitleCard;
