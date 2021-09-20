import { Box, Typography } from "@material-ui/core";
import React from "react";
import { JsxAttributes, JsxElement } from "typescript";

interface TabPanelProps {
    children: React.ReactNode,
    value: number,
    index: number,
    other?: JsxAttributes
}

export default function TabPanel({children, value, index, other}: TabPanelProps) {
  
    return (
      <div
        role="tabpanel"
        hidden={value !== index}
        id={`simple-tabpanel-${index}`}
        aria-labelledby={`simple-tab-${index}`}
        {...other}
      >
        {value === index && (
          <Box p={3}>
            <Typography>{children}</Typography>
          </Box>
        )}
      </div>
    );
  }