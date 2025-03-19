import {ModelEvaluation} from "../../features/model-evaluation/model-evaluation.jsx";
import {Box, Button, LinearProgress, Stack, Typography} from "@mui/material";
import {useEffect, useRef, useState} from "react";
import {IconChevronLeft, IconChevronRight, IconDeviceFloppy, IconLogout} from "@tabler/icons-react";
import axios from "@/axios/axios.js";
import {useAppContext} from "@/context/app-context.jsx";
import {useAuthContext} from "@/context/auth-context.jsx";
import {LoadingScreen} from "@/components/loading-screen/LoadingScreen.jsx";
import {ToastContainer, toast} from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {useNavigate} from "react-router-dom";

export const ModelEvaluationPage = () => {
    const {user, onLogout} = useAuthContext();
    const {state, dispatch} = useAppContext();
    const {currentQuestionForEvaluation, models} = state || {};
    const [question, setQuestion] = useState({});
    const [currentModel, setCurrentModel] = useState();
    const [evaluation, setEvaluation] = useState({});
    const metricsRef = useRef(null);
    const answerRef = useRef(null);
    const navigate = useNavigate();

    useEffect(() => {
        setQuestion(currentQuestionForEvaluation);

        let oldEvaluation = currentQuestionForEvaluation?.evaluation;
        if (oldEvaluation) oldEvaluation["isValid"] = true;
        setEvaluation(oldEvaluation);

        setCurrentModel(currentQuestionForEvaluation?.answer?.model);
    }, [currentQuestionForEvaluation?.question?.id]);

    useEffect(() => {
        if (currentModel !== undefined && currentModel !== null) {
            axios.get(`/api/questions/${user}?modelId=${currentModel?.id}`).then((response) => {
                dispatch({currentQuestionForEvaluation: response.data || {}});
                setQuestion(response?.data);

                let oldEvaluation = response?.data?.evaluation;
                if (oldEvaluation) oldEvaluation["isValid"] = true;
                setEvaluation(oldEvaluation);
            }).catch((error) => {
                console.log(error);
            });
        }
    }, [currentModel?.id]);

    const onSaveAndPersist = async (goToNextUnevaluatedQuestion = false) => {
        setEvaluation({...evaluation});

        if (evaluation?.isValid) {
            evaluation["answer"] = currentQuestionForEvaluation?.answer?.id;
            evaluation["username"] = user;

            await axios.post(`/api/evaluations?goToNextUnevaluatedQuestion=${goToNextUnevaluatedQuestion}`, evaluation)
                .then(() => {
                    toast.success('Evaluation saved successfully!', {
                        icon: '💾',
                        autoClose: 1500,
                        style: {
                            background: "whitesmoke",
                            color: "#58A7BF",
                            borderRadius: "7px",
                            fontSize: "13px",
                            padding: "5px 5px"
                        },
                        progressStyle: {background: "#58A7BF"}
                    });

                    let modelId = goToNextUnevaluatedQuestion ? '' : currentModel?.id;
                    axios.get(`/api/questions/${user}?modelId=${modelId}`)
                        .then(response => {
                            dispatch({
                                responses: response?.data || [],
                                currentQuestionForEvaluation: response?.data || {}
                            });
                            if (goToNextUnevaluatedQuestion) setEvaluation({});
                            else {
                                let oldEvaluation = response?.data?.evaluation;
                                if (oldEvaluation) oldEvaluation["isValid"] = true;
                                setEvaluation(oldEvaluation);
                            }
                            setCurrentModel(response?.data?.answer?.model);
                        })
                        .catch(error => console.log(error));
                })
                .catch(error => console.log(error));
        }
        smoothScrollToTop();

        setTimeout(() => {
            if (answerRef.current) answerRef.current.scrollTop = 0;
            if (metricsRef.current) metricsRef.current.scrollTop = 0;
        }, 100);
    };

    const smoothScrollToTop = (duration = 500) => {
        const start = window.scrollY || document.documentElement.scrollTop;
        const startTime = performance.now();

        function scrollStep(currentTime) {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const easeOut = progress * (2 - progress);

            window.scrollTo(0, start * (1 - easeOut));
            if (progress < 1) requestAnimationFrame(scrollStep);
        }

        requestAnimationFrame(scrollStep);
    };

    const ifCompletedFinishEvaluating = () => {
        if ((currentQuestionForEvaluation?.remainingQuestions === 0 && currentQuestionForEvaluation?.evaluatedModels.length === models.length) ||
            (currentQuestionForEvaluation?.remainingQuestions === 1 && currentQuestionForEvaluation?.evaluatedModels.length === models.length - 1)) {
            navigate('/thank-you');
        }
    };

    const onNextUnevaluated = async () => {
        await onSaveAndPersist(true);
        ifCompletedFinishEvaluating();
    };

    const onPrev = async () => {
        axios.post(`/api/questions/prev/${user}`).then(response => {
            dispatch({responses: response?.data || [], currentQuestionForEvaluation: response?.data || {}});
            let oldEvaluation = response?.data?.evaluation;
            if (oldEvaluation) oldEvaluation["isValid"] = true;
            setEvaluation(oldEvaluation);
            setCurrentModel(response?.data?.answer?.model);
        }).catch(error => console.log(error));
    };

    const onNext = async () => {
        axios.post(`/api/questions/next/${user}`).then(response => {
            dispatch({responses: response?.data || [], currentQuestionForEvaluation: response?.data || {}});
            let oldEvaluation = response?.data?.evaluation;
            if (oldEvaluation) oldEvaluation["isValid"] = true;
            setEvaluation(oldEvaluation);
            setCurrentModel(response?.data?.answer?.model);
        }).catch(error => console.log(error));
    };

    const onLogoutButton = () => {
        onLogout();
        navigate('/login');
    }

    const evaluatedQuestions = currentQuestionForEvaluation?.evaluatedQuestions;
    const remainingQuestions = currentQuestionForEvaluation?.remainingQuestions;
    const totalQuestions = evaluatedQuestions + remainingQuestions;
    const percentageLeft = Math.round((remainingQuestions / totalQuestions) * 100);

    return (
        <>
            {currentQuestionForEvaluation?.question?.id && (
                <>
                    <LinearProgress
                        variant={"buffer"}
                        value={(100 - percentageLeft) || 0}
                        valueBuffer={((100 - percentageLeft) || 0) + 5}
                        sx={{position: "fixed", top: 0, left: 0, right: 0}}
                    />
                    <Box sx={{
                        position: 'fixed',
                        top: 10,
                        right: 10,
                        zIndex: 999,
                    }}>
                        <Button
                            variant="outlined"
                            startIcon={<IconLogout size={13}/>}
                            onClick={onLogoutButton}
                            sx={{
                                borderRadius: 2,
                                bgcolor: "#f8f9fa",
                                color: "#252525",
                                "&:hover": {bgcolor: "#e1dfdf !important"},
                                fontSize: "12px",
                                padding: "5px 15px",
                            }}
                        >
                            Logout
                        </Button>
                    </Box>
                    <Box sx={{
                        display: "flex", justifyContent: "center", alignItems: "center", width: "100%", pt: 1
                    }}>
                        <Box sx={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            border: "2px solid #d1d1d1",
                            backgroundColor: "#f8f9fa",
                            padding: "4px 10px",
                            borderRadius: "8px",
                            minWidth: "250px",
                        }}>
                            <Typography variant="body2" sx={{
                                color: "#252525",
                                fontWeight: "500",
                                fontSize: "11px",
                                textAlign: "center",
                            }}>
                                You have evaluated {evaluatedQuestions} / {totalQuestions} questions.
                            </Typography>
                        </Box>
                    </Box>
                </>
            )}

            {currentQuestionForEvaluation?.question?.id ? (
                <ModelEvaluation
                    question={currentQuestionForEvaluation?.question}
                    answer={currentQuestionForEvaluation?.answer}
                    currentModel={currentQuestionForEvaluation?.answer?.model}
                    evaluatedModels={currentQuestionForEvaluation?.evaluatedModels}
                    allModels={models}
                    evaluation={evaluation}
                    setEvaluation={setEvaluation}
                    setCurrentModel={setCurrentModel}
                    metricsRef={metricsRef}
                    answerRef={answerRef}
                />
            ) : (
                <Box sx={{flex: 1}}>
                    <LoadingScreen/>
                </Box>
            )}

            {currentQuestionForEvaluation?.question?.id && (
                <Stack
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
                            bgcolor: "background.main",
                            borderTop: 1,
                            borderColor: "divider",
                            py: 2,
                            width: "100%",
                            mx: "auto",
                        }}
                    >
                        <Button
                            sx={{
                                flex: 2,
                                borderRadius: 2,
                                bgcolor: "#f1efef",
                                "&:hover": {bgcolor: "#e1dfdf !important"},
                            }}
                            startIcon={<IconChevronLeft size={18}/>}
                            onClick={onPrev}
                            disabled={currentQuestionForEvaluation?.evaluatedQuestions === 0}
                        >
                            Back
                        </Button>
                        <Button
                            variant={"text"}
                            sx={{
                                flex: 2,
                                borderRadius: 2,
                                bgcolor: "#f1efef",
                                "&:hover": {bgcolor: "#e1dfdf !important"},
                            }}
                            startIcon={<IconDeviceFloppy size={18}/>}
                            onClick={() => onSaveAndPersist()}
                            disabled={!evaluation?.isValid}
                        >
                            Save
                        </Button>
                        <Button
                            variant={"text"}
                            sx={{
                                flex: 2,
                                borderRadius: 2,
                                bgcolor: "#f1efef",
                                "&:hover": {bgcolor: "#e1dfdf !important"},
                            }}
                            startIcon={<IconChevronRight size={18}/>}
                            onClick={onNext}
                            disabled={currentQuestionForEvaluation?.evaluatedModels?.length !== models?.length}
                        >
                            Next
                        </Button>
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
                            onClick={onNextUnevaluated}
                            disabled={!evaluation?.isValid}
                        >
                            Save & Continue to next unevaluated question
                        </Button>
                    </Stack>
                </Stack>
            )}

            <ToastContainer position="top-right" autoClose={1500}/>
        </>
    );
};
