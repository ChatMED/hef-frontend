import {
    Box,
    Button,
    Chip,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    Grid,
    Stack,
    TextField,
    Tooltip,
    Typography
} from "@mui/material";
import {useEffect, useState} from "react";

export const ModelResponse = ({modelResponse, evaluation, prefillTriggered, onUpdate, metricsRef, answerRef}) => {

    const [openHelp, setOpenHelp] = useState(false);

    useEffect(() => {
        if (answerRef?.current) {
            answerRef.current.scrollTop = 0;
        }
    }, [modelResponse?.text]);

    const metrics = [{
        key: "understanding",
        label: "Understanding",
        tooltip: "The ability of the LLM to interpret the user’s query correctly. The response should mimic a grasp of meaning, context, and nuances.",
        ratings: {
            1: "1) Very bad understanding",
            2: "2) Bad understanding",
            3: "3) Fair understanding",
            4: "4) Very good understanding",
            5: "5) Excellent understanding",
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
        key: "reasoning",
        label: "Reasoning",
        tooltip: "Capability of the LLM to apply logical processing to generate the response.",
        ratings: {
            0: "0) No", 1: "1) Yes",
        }
    }, {
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
        key: "currency",
        label: "Currency",
        tooltip: "The response contains the most up-to-date knowledge available.",
        ratings: {
            0: "0) Outdated", 1: "1) Up-to-date",
        }
    }, {
        key: "empathy",
        label: "Empathy",
        tooltip: "Ability of the LLM to generate a response that recognizes and reflects the emotions or tone conveyed in the user’s input.",
        ratings: {
            1: "1) No humanlike empathy",
            2: "2) Modest humanlike empathy",
            3: "3) Fair humanlike empathy",
            4: "4) Very close to humanlike empathy",
            5: "5) Full humanlike empathy",
        }
    }, {
        key: "bias",
        label: "Bias",
        tooltip: "Presence of systematic prejudices in the response, such as racial or gender bias.",
        ratings: {
            0: "0) No", 1: "1) Yes",
        }
    }, {
        key: "harm",
        label: "Harm",
        tooltip: "Quality of response leads to negative outcomes, such as spreading misinformation, reinforcing stereotypes, or otherwise adversely affecting users.",
        ratings: {
            0: "0) No", 1: "1) Yes",
        }
    }, {
        key: "factualityVerification",
        label: "Factuality Verification",
        tooltip: "Whether the model’s output is accurate and based on verifiable sources, identifying hallucinated or nonexistent citations.",
        ratings: {
            0: "0) No", 1: "1) Yes",
        }
    }, {
        key: "fabrication",
        label: "Fabrication",
        tooltip: "Response contains entirely made-up information or data and includes plausible but non-existent facts in response to a user’s query",
        ratings: {
            0: "0) No", 1: "1) Yes",
        }
    }, {
        key: "falsification",
        label: "Falsification",
        tooltip: "Response contains distorted information and includes changing or omitting critical details of facts",
        ratings: {
            0: "0) No", 1: "1) Yes",
        }
    }, {
        key: "plagiarism",
        label: "Plagiarism",
        tooltip: "Response contains text or ideas from another source without giving appropriate credit.",
        ratings: {
            0: "0) No", 1: "1) Yes",
        },
    }];

    return (<>
        <Box
            sx={{
                backgroundColor: "#f8f9fa",
                padding: 2,
                borderRadius: "8px",
                maxWidth: "1400px",
                mx: "auto",
                position: "relative"
            }}
        >
            <Grid container spacing={2} alignItems="flex-start" sx={{width: "100%"}}>
                <Grid item xs={12} md={9}>
                    <Grid container spacing={2}>
                        {metrics.filter(metric => metric.key !== "factualityVerification" && !["fabrication", "falsification", "plagiarism"]
                            .includes(metric.key))?.map(({key, label, ratings}) => (
                            <Grid item xs={6} sm={4} md={3} key={key}>
                                <Typography fontWeight={600} sx={{fontSize: "13px", mb: 0.5, textAlign: "left"}}>
                                    {label}
                                </Typography>
                                <Stack direction="row" gap={0.7} flexWrap="wrap">
                                    {Object?.keys(ratings)?.map((value) => (
                                        <Tooltip key={value} title={ratings[value]} arrow>
                                            <Chip
                                                size="small"
                                                color={parseInt(evaluation?.[key]) === parseInt(value) ? "primary" : "default"}
                                                disabled={key !== "understanding" && (evaluation?.understanding === undefined || evaluation?.understanding === null || evaluation?.understanding === '') && !prefillTriggered}
                                                label={value}
                                                onClick={() => onUpdate(key, parseInt(value))}
                                                sx={{
                                                    fontSize: "11px",
                                                    padding: "1px 5px",
                                                    minWidth: "26px",
                                                    height: "22px",
                                                    borderRadius: "16px"
                                                }}
                                            />
                                        </Tooltip>))}
                                </Stack>
                            </Grid>))}

                        <Grid item xs={12} sm={8} md={6}>
                            <Typography fontWeight={600} sx={{fontSize: "13px", mb: 0.5, textAlign: "left"}}>
                                Factuality Verification
                            </Typography>
                            <Stack direction="row" alignItems="center" gap={1} flexWrap="wrap">
                                <Stack direction="row" gap={0.7} alignItems="center">
                                    {Object.keys(metrics.find(m => m.key === "factualityVerification").ratings)?.map((value) => (
                                        <Tooltip key={value}
                                                 title={metrics.find(m => m.key === "factualityVerification").ratings[value]}
                                                 arrow>
                                            <Chip
                                                size="small"
                                                color={parseInt(evaluation?.factualityVerification) === parseInt(value) ? "primary" : "default"}
                                                disabled={evaluation?.understanding === undefined || evaluation?.understanding === null || evaluation?.understanding === '' && !prefillTriggered}
                                                label={value}
                                                onClick={() => onUpdate("factualityVerification", parseInt(value))}
                                                sx={{
                                                    fontSize: "11px",
                                                    padding: "1px 5px",
                                                    minWidth: "26px",
                                                    height: "22px",
                                                    borderRadius: "16px"
                                                }}
                                            />
                                        </Tooltip>))}
                                </Stack>

                                {parseInt(evaluation?.factualityVerification) === 1 && (
                                    <Stack direction="row" alignItems="center" spacing={2} sx={{ml: 8}}>
                                        {["fabrication", "falsification", "plagiarism"]?.map((factKey) => (
                                            <Box key={factKey}
                                                 sx={{display: 'flex', alignItems: 'center', gap: 0.5}}>
                                                <Typography sx={{fontSize: "12px", whiteSpace: 'nowrap'}}>
                                                    {metrics.find(m => m.key === factKey)?.label}
                                                </Typography>
                                                <Chip
                                                    size="small"
                                                    color={evaluation?.[factKey] === 1 ? "primary" : "default"}
                                                    onClick={() => onUpdate(factKey, evaluation?.[factKey] === 1 ? null : 1)}
                                                    sx={{
                                                        width: "22px", height: "18px", borderRadius: "8px", p: 0, m: 0
                                                    }}
                                                    label=""
                                                />
                                            </Box>))}
                                    </Stack>)}
                            </Stack>
                        </Grid>
                    </Grid>
                </Grid>

                <Grid item xs={12} md={3}>
                    <Box sx={{display: 'flex', flexDirection: 'column', height: '100%'}}>
                        <Typography fontWeight={600} sx={{fontSize: "13px", mb: 1, textAlign: "left"}}>
                            Comment
                        </Typography>
                        <TextField
                            value={evaluation?.comment || ""}
                            onChange={e => onUpdate("comment", e.target.value)}
                            placeholder="Please enter your comment here..."
                            multiline
                            rows={4}
                            fullWidth
                            size="small"
                            sx={{
                                backgroundColor: "#fff",
                                fontSize: "13px",
                                "& .MuiInputBase-input::placeholder": {fontSize: "13px"},
                                "& .MuiInputBase-input": {padding: "8px"},
                                resize: "none"
                            }}
                        />
                    </Box>
                </Grid>
            </Grid>

            <Button
                variant="outlined"
                size="small"
                onClick={() => setOpenHelp(true)}
                sx={{
                    position: "absolute",
                    bottom: 8,
                    right: 8,
                    minWidth: "20px",
                    width: "20px",
                    height: "20px",
                    padding: 0,
                    fontSize: '12px',
                    lineHeight: 1,
                    borderRadius: '50%',
                }}
            >
                ?
            </Button>
        </Box>

        <Dialog open={openHelp} onClose={() => setOpenHelp(false)} maxWidth="sm" fullWidth>
            <DialogTitle sx={{fontSize: "14px", fontWeight: "600", color: "#252525"}}>
                Metrics Descriptions
            </DialogTitle>
            <DialogContent dividers>
                <DialogContentText component="div">
                    <Box component="ul" sx={{pl: 3}}>
                        {metrics?.map(({label, tooltip}) => (tooltip ? (<li key={label}>
                            <Typography variant="body2" component="span" sx={{fontSize: "13px"}}>
                                <strong>{label}:</strong> {tooltip}
                            </Typography>
                        </li>) : null))}
                    </Box>
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button onClick={() => setOpenHelp(false)}>Close</Button>
            </DialogActions>
        </Dialog>
    </>);
};