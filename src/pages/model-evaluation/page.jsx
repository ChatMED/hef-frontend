import {ModelEvaluation} from "../../features/model-evaluation/model-evaluation.jsx";
import {Box, Button, CircularProgress, Divider, LinearProgress, Stack, Typography} from "@mui/material";
import {useEffect, useState} from "react";
import {IconChevronLeft, IconChevronRight, IconDeviceFloppy} from "@tabler/icons-react";
import {useNavigate, useParams} from "react-router-dom";
import axios from "@/axios/axios.js";
import {toast} from "react-toastify";
import {useAppContext} from "@/context/app-context.jsx";
import {useAuthContext} from "@/context/auth-context.jsx";
import {v4 as uuid} from "uuid";
import {LoadingScreen} from "@/components/loading-screen/LoadingScreen.jsx";

export const ModelEvaluationPage = () => {
  const {user} = useAuthContext();
  const {state: {responses}, dispatch} = useAppContext();
  const [question, setQuestion] = useState({});
  const [prev, setPrev] = useState(null);
  const [next, setNext] = useState(null);
  const {id} = useParams();
  const [currentIndex, setCurrentIndex] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const attempt = localStorage.getItem("attempt");
    if (!attempt) {
      localStorage.setItem("attempt", uuid())
    }
  }, [])

  useEffect(() => {
    if (responses?.length > 0) {
      if (+id) {
        const index = responses?.findIndex(i => +i?.id === +id || +i?.q_id === +id);
        if (index >= 0) {
          const response = responses[index] || null;
          const next = responses[index + 1] || null;
          const prev = responses[index - 1] || null;
          // console.log(response, next, prev)
          setCurrentIndex(index);
          setPrev(JSON.parse(JSON.stringify(prev)));
          setNext(JSON.parse(JSON.stringify(next)));
          setQuestion(JSON.parse(JSON.stringify(response)));

          localStorage.setItem("question", response?.q_id || response?.id);
          console.log("Set question", response)
        } else {
          setCurrentIndex(0);
          setPrev(null);
          setNext(null);
          setQuestion(null);
        }

      } else {
        const response = responses[0];
        if (localStorage.getItem("attempt") && localStorage.getItem("question")) {
          console.log(localStorage.getItem("question"));
          navigate(`/question/${localStorage.getItem("question")}`);
        } else {
          navigate(`/question/${response?.q_id || response?.id}`);
        }
      }
    }
  }, [id, responses]);

  // Calculate percentage of responses left
  const totalResponses = responses.length || 1;
  const remainingResponses = totalResponses - currentIndex;
  const percentageLeft = Math.round((remainingResponses / totalResponses) * 100);


  const onSave = async (question) => {
    setQuestion({...question})
    const oldQuestion = responses?.find(i => (i?.id || i?.q_id) === (question?.id || question?.q_id));
    if (oldQuestion) {
      const oldAnswers = oldQuestion.answers || [];
      const answers = question.answers || [];
      console.log(oldAnswers, answers)
      const saveAnswers = [];
      console.log("WHAT THE FUCK")
      for (const oldAnswer of oldAnswers) {
        const newAnswer = answers?.find(i => i?.id === oldAnswer?.id);
        if (newAnswer) {
          if (
            oldAnswer.accuracy !== newAnswer.accuracy ||
            oldAnswer.bias !== newAnswer.bias ||
            oldAnswer.completeness !== newAnswer.completeness ||
            oldAnswer.relevance !== newAnswer.relevance ||
            oldAnswer.safety !== newAnswer.safety ||
            oldAnswer.comment !== newAnswer.comment
          ) {
            let attempt = localStorage.getItem("attempt");
            if (!attempt) {
              attempt = uuid();
              localStorage.setItem("attempt", attempt);
            }
            saveAnswers.push({...newAnswer, user: `${user || "anonymous"}-${attempt}`})
          }
        }
      }
      if (saveAnswers.length) {
        const toastId = toast.loading("Saving your answers...");
        for (const saveAnswer of saveAnswers) {
          try {
            await axios.post("/api/score/evaluate", {...saveAnswer});

          } catch (error) {
            toast.update(toastId, {
              render: `Failed to saved`,
              autoClose: 3000,
              type: "error",
              isLoading: false
            });
          }
          toast.update(toastId, {
            render: `Answer saved`,
            autoClose: 3000,
            type: "success",
            isLoading: false
          });
        }
        dispatch({responses: responses?.map(i => i?.id === question?.id ? ({...question}) : {...i})})
      }
    }
  }

  const onPrev = async () => {
    await onSave({...question});
    navigate(`/question/${prev?.id || prev?.q_id}`)
  }

  const onNext = async () => {
    await onSave({...question});
    if (next?.id || next?.q_id) {
      navigate(`/question/${next?.id || next?.q_id}`)
    } else if (responses?.length > 0) {
      localStorage.removeItem("attempt");
      localStorage.removeItem("question");
      navigate(`/thank-you`)
    }
  }

  return (
      <>
        <LinearProgress variant={"buffer"} value={(100 - percentageLeft) || 0} valueBuffer={((100 - percentageLeft) || 0) + 5}
                        sx={{position: "fixed", top: 0, left: 0, right: 0}}/>
        {
          question?.id || question?.q_id ?
            <ModelEvaluation question={question} setQuestion={setQuestion}/> :
            <Box sx={{flex: 1}}>
              <LoadingScreen/>
            </Box>
        }
        <Stack direction={"column"} gap={2}
               sx={{position: "fixed", bottom: 0, px: 1, left: 0, right: 0, bgcolor: "background.main",}}>
          <Stack maxWidth={"lg"} direction={"row"} gap={2}
                 useFlexGap flexWrap={"wrap"}
                 sx={{
                   bgcolor: "background.main",
                   borderTop: 1,
                   borderColor: "divider",
                   py: 2,
                   width: "100%",
                   mx: "auto"
                 }}>

            <Button
              disabled={!prev?.id && !prev?.q_id}
              sx={{
                flex: 2,
                borderRadius: 2,
                bgcolor: "#f1efef",
                color: !!prev?.id || !!prev?.q_id ? "#252525 !important" : "default",
                "&:hover": {bgcolor: "#e1dfdf !important"},
              }}
              startIcon={<IconChevronLeft size={18}/>}
              onClick={onPrev}
            >
              Back
            </Button>
            <Button
              variant={"text"}
              sx={{
                flex: 2,
                borderRadius: 2,
                bgcolor: "#f1efef",
                color: !!prev?.id || !!prev?.q_id ? "#252525 !important" : "default",
                "&:hover": {bgcolor: "#e1dfdf !important"},
              }}
              startIcon={<IconDeviceFloppy size={18}/>}
              onClick={() => onSave({...question})}
            >
              Save
            </Button>
            <Button
              variant={"contained"}
              sx={{
                flex: 5, boxShadow: 0,
                borderRadius: 2, minWidth: "200px",
                color: "#fefefe !important"
              }}
              endIcon={<IconChevronRight size={18}/>}
              onClick={onNext}
            >
              Save & Continue
            </Button>
          </Stack>
        </Stack>
      </>
  );
};
