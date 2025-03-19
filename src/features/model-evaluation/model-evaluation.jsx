import {Box, Button, Stack, Typography} from "@mui/material";
import {ModelResponse} from "@/features/model-evaluation/model-response.jsx";
import {MarkdownText} from "@/features/model-evaluation/markdown-text.jsx";

export const ModelEvaluation = ({
                                    question,
                                    answer,
                                    allModels,
                                    currentModel,
                                    evaluatedModels,
                                    evaluation,
                                    setEvaluation,
                                    setCurrentModel,
                                    metricsRef,
                                    answerRef
                                }) => {

    const modelNameMap = {
        "Claude-3.5-Sonnet": "Claude",
        "DeepSeek-R1": "DeepSeek",
        "Falcon-7B": "Falcon",
        "Gemini-1.5-Flash": "Gemini-1.5-F",
        "Gemini-2.0-Flash": "Gemini-2.0-F",
        "Gemini-Flash-2.0-Thinking": "Gemini-2.0-T",
        "Gemma-3": "Gemma-3",
        "Llama-3.3-70B-Instruct": "Llama-3.3",
        "Llama3.1-sonar-128k": "Llama-3.1",
        "MedAlpaca-7B": "MedAlpaca",
        "Mistral-Nemo": "Mistral",
        "Phi-4-Multimodal-Insurct": "Phi-4",
        "SmolVLM": "SmolVLM",
    };

    const prefillMetrics = (accuracyValue) => {
        const parsedAccuracy = parseInt(accuracyValue);

        return {
            accuracy: parsedAccuracy,
            comprehensiveness: parsedAccuracy,
            clarity: parsedAccuracy,
            bias: parsedAccuracy,
            trust: parsedAccuracy,
            relevance: parsedAccuracy,
            perceivedUsefulness: parsedAccuracy,
            empathy: parsedAccuracy <= 3 ? 0 : 1,
            harm: parsedAccuracy <= 3 ? 0 : 1,
            currency: parsedAccuracy <= 3 ? 0 : 1,
            securityAndPrivacy: parsedAccuracy <= 3 ? 0 : 1,
        };
    };

    const validateEvaluation = (evaluationData) => {
        if (!evaluationData || Object.keys(evaluationData).length === 0) return false;

        const requiredFields = ["accuracy", "comprehensiveness", "clarity", "empathy", "bias", "harm", "trust", "relevance", "currency", "securityAndPrivacy", "perceivedUsefulness"];
        const missingFields = requiredFields.filter(field => evaluationData[field] === undefined || evaluationData[field] === null || evaluationData[field] === "");
        return missingFields.length === 0;
    };

    const handleModelClick = (model) => {
        setCurrentModel(model);
    };

    return (
        <Stack
            maxWidth="1400px"
            width="100%"
            mx="auto"
            spacing={2}
            sx={{
                height: '100%',
                width: '100%',
                display: 'flex',
                flexDirection: 'column',
                overflow: 'hidden',
            }}
        >
            <Box
                sx={{
                    maxHeight: "35%",
                    overflowY: 'auto',
                    fontSize: "14px",
                    lineHeight: 1.4,
                    '&::-webkit-scrollbar': {width: '6px'},
                    '&::-webkit-scrollbar-thumb': {backgroundColor: '#c1c1c1', borderRadius: '3px'},
                }}
            >
                <Typography align="left" fontWeight={600}>Question {question?.id}</Typography>
                <Typography align="left" sx={{fontSize: '13px', lineHeight: 1.4, mt: 1.3}}>{question?.text}</Typography>
            </Box>

            <Stack direction="row" useFlexGap flexWrap="wrap" gap={1}>
                {allModels.map((model) => {
                    const isEvaluated = evaluatedModels.some((e) => e?.name === model?.name);
                    const isCurrent = currentModel?.name === model?.name;
                    const displayModelName = modelNameMap[model?.name] || model?.name;

                    return (
                        <Button
                            key={model?.name}
                            variant={isCurrent ? "contained" : isEvaluated ? "contained" : "outlined"}
                            color={isCurrent ? "warning" : isEvaluated ? "primary" : "secondary"}
                            sx={{
                                fontSize: "13px",
                                padding: "4px 7px",
                                minHeight: "30px",
                                backgroundColor: isCurrent ? "#B2527C" : undefined,
                                color: isCurrent ? "#FFFFFF" : undefined,
                                "&:hover": {backgroundColor: isCurrent ? "#B2527C" : undefined},
                            }}
                            onClick={isEvaluated || isCurrent ? () => handleModelClick(model) : undefined}
                            disabled={!isEvaluated && !isCurrent}
                        >
                            {displayModelName}
                        </Button>
                    );
                })}
            </Stack>

            <Box sx={{flex: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column'}}>
                <Box
                    sx={{
                        flex: 1,
                        overflowY: 'auto',
                        '&::-webkit-scrollbar': {width: '6px'},
                        '&::-webkit-scrollbar-thumb': {backgroundColor: '#c1c1c1', borderRadius: '3px'},
                    }}
                >
                    <Typography align="left" fontWeight={600}>Answer</Typography>
                    <Box sx={{textAlign: 'left'}}>
                        <Typography sx={{fontSize: '13px', lineHeight: 1.4, m: 0}}>
                            <MarkdownText>{answer?.text}</MarkdownText>
                        </Typography>
                    </Box>
                </Box>
            </Box>

            <ModelResponse
                modelResponse={answer}
                evaluation={evaluation}
                onUpdate={(key, value) => {
                    if (key === "accuracy") {
                        const autoFilled = prefillMetrics(value);
                        setEvaluation(prev => ({
                            ...(prev || {}),
                            ...autoFilled,
                            isValid: validateEvaluation(autoFilled)
                        }));
                    } else {
                        setEvaluation(prev => {
                            const newEval = {...(prev || {}), [key]: value};
                            newEval.isValid = validateEvaluation(newEval);
                            return newEval;
                        });
                    }
                }}
                metricsRef={metricsRef}
                answerRef={answerRef}
            />

            <Typography fontSize="small" align="center" sx={{p: 1}}>
                * When you fill-in all metrics the 'Save' and 'Save and Continue to next unevaluated question' buttons
                become available.
            </Typography>
        </Stack>
    );

}
