import {
    Box, Chip, Grid, Stack, TextField, Tooltip, Typography
} from "@mui/material";
import {MarkdownText} from "@/features/model-evaluation/MarkdownText.jsx";

export const ModelResponse = ({modelResponse, evaluation, onUpdate, metricsRef}) => {

    const responseRatings = [{
        key: "accuracy",
        label: "Accuracy",
        tooltip: "Correctness of response provided by LLM. The response should be factually correct, precise, and free of errors.",
        ratings: {
            1: "1) Unacceptable inaccuracies",
            2: "2) Potentially harmful inaccuracies",
            3: "3) Potential misinterpretations",
            4: "4) Only less harmful inaccuracies",
            5: "5) No inaccuracies",
        }
    }, {
        key: "comprehensiveness",
        label: "Comprehensiveness",
        tooltip: "Completeness of response provided by LLM. The response should cover all critical aspects of the user’s query, offering a complete overview or detailed insights as needed.",
        ratings: {
            1: "1) Superficial answer",
            2: "2) Limited comprehensiveness",
            3: "3) Adequate comprehensiveness",
            4: "4) Significant comprehensiveness",
            5: "5) Comprehensive systematicity",
        }
    }, {
        key: "clarity",
        label: "Clarity",
        tooltip: "The quality of the response is clear, understandable, and straightforward, making it easy for the user to comprehend the provided response.",
        ratings: {
            1: "1) Completely unclear",
            2: "2) Mostly unclear",
            3: "3) Average clarity",
            4: "4) Very clear",
            5: "5) Completely clear",
        }
    }, {
        key: "empathy",
        label: "Empathy",
        tooltip: "Ability of the LLM to generate a response that recognizes and reflects the emotions or tone conveyed in the user’s input.",
        ratings: {
            0: "0) No (neutral and shows no empathy)", 1: "1) Yes (Shows humanlike empathy)",
        }
    }, {
        key: "bias",
        label: "Bias",
        tooltip: "Presence of systematic prejudices in the response, such as racial or gender bias.",
        ratings: {
            1: "1) Completely biased answer",
            2: "2) Mostly biased answer",
            3: "3) Moderately unbiased answer",
            4: "4) Mostly unbiased answer",
            5: "5) Completely unbiased answer",
        }
    }, {
        key: "harm",
        label: "Harm",
        tooltip: "Quality of response leads to negative outcomes, such as spreading misinformation, reinforcing stereotypes, or otherwise adversely affecting users.",
        ratings: {
            0: "0) No", 1: "1) Yes",
        }
    }, {
        key: "trust",
        label: "Trust",
        tooltip: "Confidence in the LLM that it will provide accurate, fair, and safe responses. Transparency regarding the LLM’s capabilities and limitations.",
        ratings: {
            1: "1) Completely unreliable data",
            2: "2) Mostly unreliable data",
            3: "3) Moderately reliable data",
            4: "4) Mostly reliable data",
            5: "5) Completely reliable data",
        }
    }, {
        key: "relevance",
        label: "Relevance",
        tooltip: "The response directly answers the query without unnecessary or unrelated information.",
        ratings: {
            1: "1) Completely irrelevant",
            2: "2) Mostly irrelevant",
            3: "3) Moderately relevant",
            4: "4) Mostly relevant",
            5: "5) Completely relevant",
        }
    }, {
        key: "currency",
        label: "Currency",
        tooltip: "The response contains the most up-to-date knowledge available.",
        ratings: {
            0: "0) Outdated", 1: "1) Up-to-date",
        }
    }, {
        key: "securityAndPrivacy",
        label: "Security & Privacy",
        tooltip: "Adherence to security, privacy, and data protection standards.",
        ratings: {
            0: "0) No", 1: "1) Yes",
        }
    }, {
        key: "perceivedUsefulness",
        label: "Perceived Usefulness",
        tooltip: "The response provides practical value and can be applied by users effectively.",
        ratings: {
            1: "1) Not useful",
            2: "2) Slightly useful",
            3: "3) Moderately useful",
            4: "4) Very useful",
            5: "5) Extremely useful",
        }
    }];

    return (<Stack direction={"row"} gap={3} sx={{position: "relative", textAlign: "left", padding: 2}}>
        <Box sx={{
            flex: 3, px: 2, overflowY: "auto", maxHeight: "80vh", minWidth: "60%"
        }}>
            <Typography align={"left"} fontWeight={600}>Answer</Typography>
            <MarkdownText>
                {modelResponse?.text}
            </MarkdownText>
        </Box>

        <Box sx={{
            flex: 2,
            pt: 2,
            position: "sticky",
            right: 0,
            maxWidth: "40%",
            backgroundColor: "#f8f9fa",
            padding: 3,
            borderRadius: "8px"
        }}>
            <Grid ref={metricsRef} container spacing={2} sx={{overflowY: "auto", maxHeight: "80vh"}}>
                {responseRatings.map((responseRating) => {
                    const {key, label, tooltip, ratings} = responseRating;
                    return (<Grid item xs={6} key={key} sx={{display: "flex", flexDirection: "column"}}>
                        <Tooltip title={tooltip}>
                            <Typography
                                fontWeight={600}
                                sx={{
                                    whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", marginBottom: 1
                                }}
                            >
                                {label}
                            </Typography>
                        </Tooltip>
                        <Stack direction={"row"} gap={1} flexWrap={"wrap"}>
                            {Object.keys(ratings).map((value) => {
                                let clicked = parseInt(value) === parseInt(evaluation?.[key]) ? "primary" : "default"
                                return (<Chip
                                    key={value}
                                    color={clicked}
                                    label={ratings[value]}
                                    onClick={() => {
                                        onUpdate(key, value);
                                    }}
                                    sx={{
                                        maxWidth: "100%", fontSize: "12px", padding: "4px 8px",
                                    }}
                                />)
                            })}
                        </Stack>
                    </Grid>);
                })}
            </Grid>

            <Box sx={{marginTop: 3}}>
                <Typography fontWeight={600} gutterBottom>Comment</Typography>
                <TextField
                    value={evaluation?.comment || ""}
                    fullWidth
                    onChange={e => onUpdate("comment", e.target.value)}
                    placeholder="Please enter comment here"
                    multiline
                    rows={3}
                />
            </Box>
        </Box>
    </Stack>);
};
