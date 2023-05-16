/* eslint-disable react-hooks/exhaustive-deps */
import {
  Autocomplete,
  Box,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Modal,
  Select,
  TextField,
} from "@mui/material"
import axiosInstanceAuth from "apiServices/axiosInstanceAuth"
import MDBox from "components/MDBox"
import MDButton from "components/MDButton"
import MDInput from "components/MDInput"
import MDTypography from "components/MDTypography"
import useEncryption from "customHook/useEncryption"
import React, { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { toast } from "react-toastify"
import CloseIcon from "@mui/icons-material/Close"

const EditQuestion = (props) => {
  const { open, onClose, onConfirmClose, editData, flag, topics } = props
  const { encryptData, decryptData } = useEncryption()

  const [topicsList, setTopicsList] = useState([])
  const [difficulty, setDifficulty] = useState([])
  const [laval, setLaval] = useState()

  const navigate = useNavigate()

  const [formdata, setFormData] = useState({
    question: "",
    correct_answer: "",
    wrong_answer_1: "",
    wrong_answer_2: "",
    wrong_answer_3: "",
    difficulty_level: "",
    time_for_answer: "",
    is_question_image: "0",
    time_for_question: "",
  })

  const [preview, setPreview] = useState([])
  const [logo, setLogo] = useState()

  useEffect(() => {
    if (editData) {
      setFormData({
        question: editData.question,
        correct_answer: editData.correct_answer,
        wrong_answer_1: editData.wrong_answer_1,
        wrong_answer_2: editData.wrong_answer_2,
        wrong_answer_3: editData.wrong_answer_3,
        time_for_answer: editData.time_for_answer,
        is_question_image: editData.is_question_image,
        time_for_question: editData.time_for_question,
      })
      editData.question_image && setPreview(editData.question_image)
      editData.question_topics && setTopicsList(editData.question_topics)
      editData.question_countries_relevance &&
      editData.question_regional_relevance &&
      editData.difficulty_level && setLaval(editData.difficulty_level)
      if (editData.difficulty_level_id) {
      }
      if (editData?.topic_country?.id) {
        getRegions(editData?.topic_country?.id)
      }
    } else {
    }
    getRegions()
  }, [editData])

  const handleChangeAutoDifficulty = (event, value) => {
    setLaval(value)
  }

  const handleChange = (event) => {
    const { name, value } = event.target
    if (name === "time_for_answer" || name === "time_for_question") {
      if (value >= 0) {
        setFormData({
          ...formdata,
          [name]: value,
        })
      } else {
      }
    } else if (name === "question") {
      if (value.length > 140 && value.length <= 330) {
        setFormData({
          ...formdata,
          question: value,
          is_question_image: "0",
        })
      } else if (value.length <= 140) {
        setFormData({
          ...formdata,
          [name]: value,
        })
      }
    } else if (((name === "correct_answer") || (name === "wrong_answer_1") || (name === "wrong_answer_2") || (name === "wrong_answer_3"))) {
      if (value.length <= 140) {
        setFormData({
          ...formdata,
          [name]: value,
        });
      }
    } else {
      setFormData({
        ...formdata,
        [name]: value,
      })
    }
  }

  const stringTopicsList = JSON.stringify(topicsList.map((d) => d.id))
  const handleSubmit = async () => {
    if (formdata.question.length === 0) {
      toast.error("Please Enter question Type ")
    } else if (formdata.question.length === 0) {
      toast.error("Invalid file format")
    } else {
      if (formdata.regional_relevance === "Global") {
        const encryptedData = encryptData(
          JSON.stringify({
            question: formdata.question,
            correct_answer: formdata.correct_answer,
            wrong_answer_1: formdata.wrong_answer_1,
            wrong_answer_2: formdata.wrong_answer_2,
            wrong_answer_3: formdata.wrong_answer_3,
            topics: stringTopicsList,
            difficulty_level_id: laval.id,
            time_for_question: formdata.time_for_question,
            time_for_answer: formdata.time_for_answer,
            is_question_image: formdata.is_question_image,
            id: editData.id,
          })
        )
        const formData = new FormData()
        formData.append("data", encryptedData)
        logo && formData.append("file", logo)
        await axiosInstanceAuth
          .put(`/admin/questionnaires/edit`, formData)
          .then((res) => {
            if (res.data.status) {
              toast.success(res.data.message)
              onConfirmClose()
              onClose()
              setLogo()
            } else {
              toast.error(res.data.message)
              setLogo()
            }
          })
          .catch((err) => {
            toast.error(err)
          })
      } else {
        const encryptedData = encryptData(
          JSON.stringify({
            question: formdata.question,
            correct_answer: formdata.correct_answer,
            wrong_answer_1: formdata.wrong_answer_1,
            wrong_answer_2: formdata.wrong_answer_2,
            wrong_answer_3: formdata.wrong_answer_3,
            topics: stringTopicsList,
            difficulty_level: formdata.difficulty_level,
            // regional_relevance: formdata.regional_relevance,

            // countries: fiedCountry,
            difficulty_level_id: laval.id,

            time_for_question: formdata.time_for_question,
            time_for_answer: formdata.time_for_answer,
            is_question_image: formdata.is_question_image,
            id: editData.id,
          })
        )
        const formData = new FormData()
        formData.append("data", encryptedData)
        logo && formData.append("file", logo)
        await axiosInstanceAuth
          .put(`/admin/questionnaires/edit`, formData)
          .then((res) => {
            if (res.data.status) {
              toast.success(res.data.message)
              onConfirmClose()
              onClose()
              setLogo()
            } else {
              toast.error(res.data.message)
              setLogo()
            }
          })
          .catch((err) => {
            toast.error(err)
            setLogo()
          })
      }
    }
  }

  useEffect(() => {
    if (formdata.regional_relevance === "Local") {
      // countyGet();
    } else {
    }
  }, [formdata.regional_relevance])

  const getRegions = async () => {
    await axiosInstanceAuth
      .get(`admin/difficulty_levels/get`)
      .then((res) => {
        const data = decryptData(res.data.data)
        if (res.data.status) {
          setDifficulty(data)
        } else {
          setDifficulty([])
          toast.error(data?.message)
        }
      })
      .catch((err) => {
        setDifficulty([])
        console.log(err)
      })
  }

  const handleChangeAutocompleteTopic = (event, value, reason) => {
    setTopicsList(value)
  }

  const handleLogoChange = (e) => {
    e.preventDefault()
    let file = e.target.files[0]
    let reader = new FileReader()
    reader.onloadend = () => {
      setLogo(file)
      setPreview(reader.result)
    }
    reader.readAsDataURL(file)
  }

  useEffect(() => {
    onSearChrist({ access: "All", regional_relevance: "All", countries: "" })
  }, [])

  const onSearChrist = async (dataFilter) => {
    const formData = new FormData()
    formData.append("data", encryptData(JSON.stringify(dataFilter)))
    await axiosInstanceAuth
      .post(`/admin/topics/get`, formData)
      .then((res) => {
        const decryptedData = decryptData(res.data.data)
        if (res.data.status) {
          const data = decryptedData
          // setTopics(data);
        } else {
          // setTopics([])
          toast.error(res.data?.message)
          if (res.data.isAuth === false) {
            localStorage.clear()
            navigate("/sign-in")
          } else if (!localStorage.getItem("token")) {
            navigate("/sign-in")
          }
        }
      })
      .catch((err) => {
        toast.error(err)
      })
  }

  const imageStyle = {
    height: "100px",
    width: "100px",
    border: "1px dashed $darkBlue",
    borderRadius: "50%",
  }

  const modalStyle = {
    bgcolor: "background.paper",
    position: "absolute",
    top: "9%",
    left: "50%",
    transform: "translate(-50%, 0%)",
    width: 1000,
    border: "0px solid #000",
    boxShadow: 24,
    borderRadius: 4,
    p: 4,
    overflow: "auto",
  }
  const modal = {
    overflow: "scroll",
  }

  const onCloseEditModal = (event, reason) => {
    if (reason && reason == "backdropClick") return
    else onClose()
  }

  return (
    <>
      <Modal
        open={open}
        onClose={onCloseEditModal}
        sx={modal}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={modalStyle}>
          <button className="icon-end-close" onClick={onClose}>
            <div className="close-icon">
              <CloseIcon />
            </div>
          </button>
          <MDBox mx={2} p={1} textAlign="center">
            <MDTypography variant="h4" fontWeight="medium">
              {flag === true ? "View Question" : " Edit Question"}
            </MDTypography>
          </MDBox>
          <MDBox pt={4} px={3}>
            <MDBox component="form" role="form">
              <Grid
                container
                rowSpacing={0.5}
                columnSpacing={{
                  xs: 1,
                  sm: 2,
                  md: 3,
                }}
              >
                {/* ""question" */}
                <Grid item xs={12}>
                  <MDBox mb={3}>
                    <FormControl sx={{ width: "100%" }}>
                      <TextField
                        type="text"
                        multiline
                        onChange={handleChange}
                        name="question"
                        value={formdata.question}
                        disabled={flag}
                        label="Question"
                        fullWidth
                      />
                    </FormControl>
                  </MDBox>
                </Grid>
                {/* correct_answer */}
                <Grid item xs={6}>
                  <MDBox mb={3}>
                    <TextField
                      type="text"
                      multiline
                      onChange={handleChange}
                      name="correct_answer"
                      value={formdata.correct_answer}
                      disabled={flag}
                      label="Correct Answer"
                      fullWidth
                    />
                  </MDBox>
                </Grid>
                {/* wrong_answer_1  */}
                <Grid item xs={6}>
                  <MDBox mb={3}>
                    <FormControl sx={{ width: "100%" }}>
                      <TextField
                        type="text"
                        multiline
                        onChange={handleChange}
                        name="wrong_answer_1"
                        disabled={flag}
                        value={formdata.wrong_answer_1}
                        label="Wrong Answer 1"
                        fullWidth
                      />
                    </FormControl>
                  </MDBox>
                </Grid>
                {/* wrong_answer_2 */}
                <Grid item xs={6}>
                  <MDBox mb={3}>
                    <FormControl sx={{ width: "100%" }}>
                      <TextField
                        type="text"
                        multiline
                        onChange={handleChange}
                        name="wrong_answer_2"
                        disabled={flag}
                        value={formdata.wrong_answer_2}
                        label="Wrong Answer 2"
                        fullWidth
                      />
                    </FormControl>
                  </MDBox>
                </Grid>
                {/* wrong_answer_3 */}
                <Grid item xs={6}>
                  <MDBox mb={3}>
                    <FormControl sx={{ width: "100%" }}>
                      <TextField
                        type="text"
                        multiline
                        onChange={handleChange}
                        disabled={flag}
                        name="wrong_answer_3"
                        value={formdata.wrong_answer_3}
                        label="Wrong Answer 3"
                        fullWidth
                      />
                    </FormControl>
                  </MDBox>
                </Grid>
                {/* Topic */}
                <Grid item xs={6}>
                  <MDBox mb={3}>
                    <Autocomplete
                      ListboxProps={{
                        style: { maxHeight: 200, overflow: "auto" },
                      }}
                      multiple
                      disabled={flag}
                      id="tags-outlined"
                      options={topics}
                      defaultValue={editData.question_topics}
                      value={topicsList}
                      onChange={handleChangeAutocompleteTopic}
                      getOptionLabel={(option) => option.name}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          variant="outlined"
                          label="Topic"
                          placeholder={
                            topicsList.length > 0 ? "" : !flag && "Topic"
                          }
                        />
                      )}
                    />
                  </MDBox>
                </Grid>
                {/* difficulty_level */}
                <Grid item xs={6}>
                  <MDBox mb={3}>
                    <Autocomplete
                      id="tags-outlined"
                      options={difficulty}
                      disabled={flag}
                      onChange={handleChangeAutoDifficulty}
                      defaultValue={laval}
                      value={laval}
                      getOptionLabel={(option) => option.name}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          variant="outlined"
                          label="Difficulty Level"
                        />
                      )}
                    />
                  </MDBox>
                </Grid>

                {/* Time For Question */}
                <Grid item xs={6}>
                  <MDBox mb={3}>
                    <FormControl sx={{ width: "100%" }}>
                      <MDInput
                        sx={{ height: "44.125px" }}
                        disabled={flag}
                        type="number"
                        className="input-box"
                        min="0"
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        name="time_for_question"
                        value={formdata.time_for_question}
                        label="Time For Question  [Seconds]"
                        fullWidth
                        onChange={handleChange}
                      />
                    </FormControl>
                  </MDBox>
                </Grid>
                {/* time_for_answer */}
                <Grid item xs={6}>
                  <MDBox mb={3}>
                    <FormControl sx={{ width: "100%" }}>
                      <MDInput
                        sx={{ height: "44.125px" }}
                        type="number"
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        name="time_for_answer"
                        disabled={flag}
                        className="input-box"
                        min="0"
                        value={formdata.time_for_answer}
                        label="Time For Answer [Seconds]"
                        fullWidth
                        onChange={handleChange}
                      />
                    </FormControl>
                  </MDBox>
                </Grid>
                {formdata.question.length <= 140 && (
                  <>
                    <Grid item xs={6}>
                      <MDBox mb={3}>
                        <FormControl sx={{ width: "100%" }}>
                          <InputLabel id="demo-simple-select-label">
                            Question Image
                          </InputLabel>
                          <Select
                            sx={{ height: "44.125px" }}
                            id="demo-simple-select"
                            disabled={flag}
                            name="is_question_image"
                            value={formdata.is_question_image}
                            label="Question Image"
                            fullWidth
                            onChange={handleChange}
                          >
                            <MenuItem value={0}>NO</MenuItem>
                            <MenuItem value={1}>YES</MenuItem>
                          </Select>
                        </FormControl>
                      </MDBox>
                    </Grid>
                    {/* image  */}
                    {formdata.is_question_image === 1 && (
                      <Grid item xs={12}>
                        <MDBox pb={5} textAlign="center">
                          <div>
                            <div className="image-center">
                              <div
                                className=" d-flex p-1"
                                style={imageStyle}
                                sx={{ borderRadius: "50%" }}
                              >
                                <label
                                  htmlFor="photo-upload"
                                  className="custom-file-upload fas"
                                >
                                  <div className="img-wrap img-upload">
                                    <img
                                      for="photo-upload"
                                      src={preview}
                                      alt=""
                                    />
                                  </div>
                                  <input
                                    id="photo-upload"
                                    type="file"
                                    disabled={flag}
                                    onChange={(e) => handleLogoChange(e)}
                                  />
                                </label>
                              </div>
                            </div>
                            <button type="button" className="image-change-btn">
                              <label
                                style={{
                                  fontSize: "12px",
                                  color: "#ffffff",
                                  cursor: "pointer",
                                  padding: "15px",
                                }}
                                htmlFor="logoImage"
                              >
                                Upload
                                <input
                                  id="logoImage"
                                  type="file"
                                  hidden={true}
                                  name="logo"
                                  accept="image/*"
                                  disabled={flag}
                                  onChange={(e) => handleLogoChange(e)}
                                />
                              </label>
                            </button>
                          </div>
                        </MDBox>
                      </Grid>
                    )}
                  </>
                )}
              </Grid>
              <MDBox mt={2}>
                {flag === true ? (
                  <MDBox mt={2}>
                    <MDButton
                      onClick={onClose}
                      variant="gradient"
                      color="info"
                      fullWidth
                    >
                      Close
                    </MDButton>
                  </MDBox>
                ) : (
                  <MDBox mt={2}>
                    <MDButton
                      onClick={handleSubmit}
                      variant="gradient"
                      color="info"
                      fullWidth
                    >
                      Save Changes
                    </MDButton>
                  </MDBox>
                )}
              </MDBox>
            </MDBox>
          </MDBox>
        </Box>
      </Modal>
    </>
  )
}

export default EditQuestion
