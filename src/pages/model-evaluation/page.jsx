import {ModelEvaluation} from "../../features/model-evaluation/model-evaluation.jsx";
import {Box, Button, CircularProgress, LinearProgress, Stack, Typography} from "@mui/material";
import {useEffect, useRef, useState} from "react";
import {IconChevronRight} from "@tabler/icons-react";
import axios from "@/axios/axios.js";
import {useAppContext} from "@/context/app-context.jsx";
import {useAuthContext} from "@/context/auth-context.jsx";
import {LoadingScreen} from "@/components/loading-screen/LoadingScreen.jsx";

export const ModelEvaluationPage = () => {
    const {user} = useAuthContext();
    const {state, dispatch} = useAppContext();
    const {currentQuestionForEvaluation, models} = state || {};
    const [currentModel, setCurrentModel] = useState();
    const [question, setQuestion] = useState({});
    const [evaluation, setEvaluation] = useState({});
    const [prev] = useState(null);
    const [currentIndex] = useState(0);
    const metricsRef = useRef(null);
    const answerRef = useRef(null);

    useEffect(() => {
        setQuestion(currentQuestionForEvaluation);
    }, [currentQuestionForEvaluation?.question?.id]);

    useEffect(() => {
        if (currentModel !== undefined && currentModel !== null) {
            axios.get(`/api/questions/next/${user}?modelId=${currentModel?.id}`).then((response) => {
                dispatch({currentQuestionForEvaluation: response.data || {}})
                setQuestion(response?.data);

                let oldEvaluation = response?.data?.evaluation;
                if (oldEvaluation)
                    oldEvaluation["isValid"] = true;
                setEvaluation(oldEvaluation);
            }).catch((error) => {
                console.log(error)
            });
        }
    }, [currentModel?.id])

    const onSaveAndPersist = async () => {
        setEvaluation({...evaluation})

        if (evaluation?.isValid) {
            evaluation["answer"] = currentQuestionForEvaluation?.answer?.id;
            evaluation["username"] = user

            await axios.post("/api/evaluations", evaluation)
                .then(() => axios.get(`/api/questions/next/${user}`)
                    .then(response => {
                        dispatch({responses: response.data || [], currentQuestionForEvaluation: response.data || {}});
                        setEvaluation({})
                        setCurrentModel(response?.data?.answer?.model);
                    })
                    .catch(error => console.log(error)));
        }
    }

    const smoothScrollToTop = (duration = 500) => {
        const start = window.scrollY || document.documentElement.scrollTop;
        const startTime = performance.now();

        function scrollStep(currentTime) {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const easeOut = progress * (2 - progress);

            window.scrollTo(0, start * (1 - easeOut));
            if (progress < 1) {
                requestAnimationFrame(scrollStep);
            }
        }

        requestAnimationFrame(scrollStep);
    }

    const onNext = async () => {
        await onSaveAndPersist({...evaluation});
        smoothScrollToTop();

        setTimeout(() => {
            if (answerRef.current) {
                answerRef.current.scrollTop = 0;
            }
            if (metricsRef.current) {
                metricsRef.current.scrollTop = 0;
            }
        }, 100);
    }

    const evaluatedQuestions = currentQuestionForEvaluation?.evaluatedQuestions;
    const remainingQuestions = currentQuestionForEvaluation?.remainingQuestions;
    const totalQuestions = evaluatedQuestions + remainingQuestions;
    const percentageLeft = Math.round((remainingQuestions / totalQuestions) * 100)
    return (<>
        {currentQuestionForEvaluation?.question?.id && (<>
            <LinearProgress
                variant={"buffer"}
                value={(100 - percentageLeft) || 0}
                valueBuffer={((100 - percentageLeft) || 0) + 5}
                sx={{position: "fixed", top: 0, left: 0, right: 0}}
            />
            <Box
                sx={{
                    display: "flex", justifyContent: "center", alignItems: "center", width: "100%", pt: 1
                }}
            >
                <Box
                    sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        border: "2px solid #d1d1d1",
                        backgroundColor: "#f8f9fa",
                        padding: "4px 10px",
                        borderRadius: "8px",
                        minWidth: "250px",
                    }}
                >
                    <Typography
                        variant="body2"
                        sx={{
                            color: "#252525", fontWeight: "500", fontSize: "11px", textAlign: "center",
                        }}
                    >
                        You have evaluated {evaluatedQuestions} / {totalQuestions} questions.
                    </Typography>
                </Box>
            </Box>
        </>)}

        {currentQuestionForEvaluation?.question?.id ? <ModelEvaluation question={currentQuestionForEvaluation?.question}
                                                                       answer={currentQuestionForEvaluation?.answer}
                                                                       currentModel={currentQuestionForEvaluation?.answer?.model}
                                                                       evaluatedModels={currentQuestionForEvaluation?.evaluatedModels}
                                                                       allModels={models}
                                                                       evaluation={evaluation}
                                                                       setEvaluation={setEvaluation}
                                                                       setCurrentModel={setCurrentModel}
                                                                       metricsRef={metricsRef}
                                                                       answerRef={answerRef}/> : <Box sx={{flex: 1}}>
            <LoadingScreen/>
        </Box>}
        {currentQuestionForEvaluation?.question?.id && (<Stack
            direction={"column"}
            gap={2}
            sx={{position: "fixed", bottom: 0, px: 1, left: 0, right: 0, bgcolor: "background.main"}}
        >
            <Stack
                maxWidth={"lg"}
                direction={"row"}
                gap={2}
                useFlexGap
                flexWrap={"wrap"}
                sx={{
                    bgcolor: "background.main", borderTop: 1, borderColor: "divider", py: 2, width: "100%", mx: "auto",
                }}
            >
                <Button
                    variant={"contained"}
                    sx={{
                        flex: 5,
                        boxShadow: 0,
                        borderRadius: 2,
                        minWidth: "200px",
                        color: "#fefefe !important",
                        bgcolor: evaluation?.isValid ? "primary.main" : "grey.400",
                        "&:hover": {
                            bgcolor: evaluation?.isValid ? "primary.dark" : "grey.500",
                        },
                    }}
                    endIcon={<IconChevronRight size={18}/>}
                    onClick={onNext}
                    disabled={!evaluation?.isValid}
                >
                    Save & Continue to next question
                </Button>
            </Stack>
        </Stack>)}

    </>);
};
