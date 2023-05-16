/* eslint-disable react-hooks/exhaustive-deps */
import {
  Autocomplete,
  Box,
  FormControl,
  FormControlLabel,
  Grid,
  InputLabel,
  MenuItem,
  Modal,
  Select,
  Switch,
  TextField,
} from "@mui/material";
import axiosInstanceAuth from "apiServices/axiosInstanceAuth";
import MDBox from "components/MDBox";
import MDButton from "components/MDButton";
import MDInput from "components/MDInput";
import MDTypography from "components/MDTypography";
import useEncryption from "customHook/useEncryption";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import CloseIcon from "@mui/icons-material/Close";

const AddTopics = (props) => {
  const { open, onClose, onConfirmClose, categoryData } = props;
  const { encryptData, decryptData } = useEncryption();
  const [tags, setTags] = React.useState([]);
  const [countriesList, setCountriesList] = useState([]);
  const [country, setCountry] = useState([]);
  const [countries, setCountries] = useState();
  const [values, setValues] = useState("");
  const navigate = useNavigate();
  const [formdata, setFormData] = useState({
    name: "",
    description: "",
    access: "Open",
    color_code: "#000000",
    regional_relevance: "Global",
    game_mode: "Training",
    match_format: "Blitz",
    time_for_question: 10,
    number_of_questions: 7,
    access_code: "",
  });
  const [preview, setPreview] = useState([]);
  const [logo, setLogo] = useState();
  const [switchBot, setSwitchBot] = useState(true);
  const [popular, setPopular] = useState(false);
  const [featured, setFeatured] = useState(false);

  const removeTag = (i) => {
    const newTags = [...tags];
    newTags.splice(i, 1);
    setTags(newTags);
  };

  const inputKeyDown = (e) => {
    const val = e.target.value;
    setValues(val);
    if (e.key === "Enter" && val) {
      if (tags.find((tag) => tag.toLowerCase() === val.toLowerCase())) {
        return;
      }
      setTags([...tags, val]);
      setFormData({
        ...formdata,
        ["search_tags"]: tags,
      });
      setValues("");
    } else if (e.key === "Backspace" && !val) {
      removeTag(tags.length - 1);
    }
  };

  // onChange /?/^\S*$/
  var regexp = /^[ A-Za-z0-9]*$/;
  var space = /^\S*$/;
  const handleChange = (event) => {
    const { name, value } = event.target;
    console.log(value,"Color")
    if (value.toLocaleLowerCase() === "classic") {
      setFormData({
        ...formdata,
        number_of_questions: 10,
        time_for_question: 180,
        [name]: value,
      });
    } else if (name === "name") {
      if (value) {
        setFormData({
          ...formdata,
          [name]: value.slice(0, 120),
        });
      } else {
        setFormData({
          ...formdata,
          [name]: value.slice(0, 120),
        });
      }
    } else if (value === "Blitz") {
      setFormData({
        ...formdata,
        number_of_questions: 7,
        time_for_question: 20,
        [name]: value,
      });
    } else if (
      name === "number_of_questions" ||
      name === "time_for_question" ||
      name === "learning_point"
    ) {
      if (value >= 0) {
        setFormData({
          ...formdata,
          [name]: value,
        });
      } else {
      }
    } else if (name === "access_code") {
      if (regexp.test(value)) {
        if (space.test(value))
          setFormData({
            ...formdata,
            [name]: value,
          });
      } else {
      }
    } else if (name === "description") {
      if (value) {
        setFormData({
          ...formdata,
          [name]: value.slice(0, 200),
        });
      } else {
        setFormData({
          ...formdata,
          [name]: value,
        });
      }
    } else if (name === "access") {
      if (value === "Closed") {
        setSwitchBot(false);
        setFormData({
          ...formdata,
          [name]: value.slice(0, 200),
        });
      } else {
        setSwitchBot(true);
        setFormData({
          ...formdata,
          [name]: value,
        });
      }
    } else {
      setFormData({
        ...formdata,
        [name]: value.slice(0, 200),
      });
    }
  };

  const countriesRingified = JSON.stringify(countries);
  const fiedCountry = JSON.stringify(country.map((d, i) => d.id));
  const stringifiedsearch_tags = JSON.stringify(tags);

  const handleSubmit = async () => {
    if (formdata.name.length === 0) {
      toast.error("Please Enter your Name ");
    } else if (formdata.description.length === 0) {
      toast.error("Please Enter your description");
    } else {
      if (formdata.regional_relevance === "Global") {
        const encrypt = encryptData(
          JSON.stringify({
            name: formdata.name,
            description: formdata.description,
            access: formdata.access,
            color_code: formdata.color_code,
            regional_relevance: formdata.regional_relevance,
            game_mode: formdata.game_mode,
            time_for_question: formdata.time_for_question,
            match_format: formdata.match_format,
            number_of_questions: formdata.number_of_questions,
            categories: countriesRingified,
            countries: "",
            search_tags: stringifiedsearch_tags,
            access_code:
              formdata.access === "Closed" ? formdata.access_code : "",
            allow_bot: switchBot === true ? 0 : 1,
            is_featured: featured === true ? 1 : 0,
            is_popular: popular === true ? 1 : 0,
          })
        );
        const formData = new FormData();
        formData.append("data", encrypt);
        formData.append("file", logo);
        await axiosInstanceAuth
          .post(`/admin/topics/add`, formData)
          .then((res) => {
            if (res.data.status) {
              toast.success(res.data.message);
              onConfirmClose();
              onClose();
            } else {
              toast.error(res.data.message);
            }
          })
          .catch((err) => {
            toast.error(err);
          });
      } else {
        const encrypt = encryptData(
          JSON.stringify({
            name: formdata.name,
            description: formdata.description,
            access: formdata.access,
            color_code: formdata.color_code,
            regional_relevance: formdata.regional_relevance,
            game_mode: formdata.game_mode,
            time_for_question: formdata.time_for_question,
            match_format: formdata.match_format,
            number_of_questions: formdata.number_of_questions,
            categories: countriesRingified,
            countries: fiedCountry,
            search_tags: stringifiedsearch_tags,
            access_code:
              formdata.access === "Closed" ? formdata.access_code : "",
            allow_bot: switchBot === true ? 1 : 0,
            is_featured: featured === true ? 1 : 0,
            is_popular: popular === true ? 1 : 0,
          })
        );
        const formData = new FormData();
        formData.append("data", encrypt);
        formData.append("file", logo);
        await axiosInstanceAuth
          .post(`/admin/topics/add`, formData)
          .then((res) => {
            if (res.data.status) {
              toast.success(res.data.message);
              onConfirmClose();
              onClose();
            } else {
              toast.error(res.data.message);
            }
          })
          .catch((err) => {
            toast.error(err);
          });
      }
    }
  };

  const countyGet = async () => {
    await axiosInstanceAuth
      .get("admin/countries/get")
      .then((res) => {
        const data = decryptData(res.data.data);
        if (res.data.status) {
          setCountriesList(data?.data);
        } else {
          if (res.data.isAuth === false) {
            localStorage.clear();
            navigate("/sign-in");
          } else if (!localStorage.getItem("token")) {
            navigate("/sign-in");
          }
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    if (formdata.regional_relevance === "Local") {
      countyGet();
    } else {
    }
  }, [formdata.regional_relevance]);

  const handleChangeAutocomplete = (event, value) => {
    setCountry(value);
  };

  const handleChangecategories = (event, value) => {
    setCountries(value.map((d, i) => d.id));
  };

  const handleLogoChange = (e) => {
    e.preventDefault();
    let file = e.target.files[0];
    let reader = new FileReader();
    reader.onloadend = () => {
      setLogo(file);
      setPreview(reader.result);
    };
    reader.readAsDataURL(file);
  };
  const imageStyle = {
    height: "100px",
    width: "100px",
    border: "1px dashed $darkBlue",
    borderRadius: "50%",
  };

  const modalStyle = {
    bgcolor: "background.paper",
    position: "absolute",
    top: "3%",
    left: "50%",
    transform: "translate(-50%, 0%)",
    width: 1000,
    border: "0px solid #000",
    boxShadow: 24,
    borderRadius: 4,
    p: 4,
    overflow: "auto",
  };
  const modal = {
    overflow: "scroll",
  };

  const onCloseEditModal = (event, reason) => {
    if (reason && reason == "backdropClick") return;
    else onClose();
  };


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
              Add Topics
            </MDTypography>
          </MDBox>
          <MDBox pt={4} px={3}>
            {/* image  */}

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
                        <img for="photo-upload" src={preview} alt="" />
                      </div>
                      <input
                        id="photo-upload"
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleLogoChange(e)}
                      />
                    </label>
                  </div>
                </div>
                <button type="button" className="image-change-btn">
                  <label
                    style={{
                      fontSize: "12px",

                      cursor: "pointer",
                      padding: "15px",
                      color: "#ffffff",
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
                      onChange={(e) => handleLogoChange(e)}
                    />
                  </label>
                </button>
              </div>
            </MDBox>

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
                {/* name */}

                <Grid item xs={12}>
                  <MDBox mb={3}>
                    <FormControl sx={{ width: "100%" }}>
                      <MDInput
                        sx={{ height: "44.125px" }}
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        name="name"
                        value={formdata.name}
                        label="Name"
                        fullWidth
                        onChange={handleChange}
                      />
                    </FormControl>
                  </MDBox>
                </Grid>

                {/* description */}
                <Grid item xs={12}>
                  <MDBox mb={3}>
                    <TextField
                      type="text"
                      rows={2}
                      multiline
                      onChange={handleChange}
                      name="description"
                      value={formdata.description}
                      label="Description"
                      fullWidth
                    />
                  </MDBox>
                </Grid>

                {/* access  */}

                <Grid item xs={6}>
                  <MDBox mb={3}>
                    <FormControl sx={{ width: "100%" }}>
                      <InputLabel id="demo-multiple-name-label">
                        Access
                      </InputLabel>
                      <Select
                        sx={{ height: "44.125px" }}
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        name="access"
                        value={formdata.access}
                        label="Access"
                        fullWidth
                        onChange={handleChange}
                      >
                        <MenuItem value="Open">Open</MenuItem>
                        <MenuItem value="Closed">Closed</MenuItem>
                      </Select>
                    </FormControl>
                  </MDBox>
                </Grid>

                {formdata.access === "Closed" && (
                  <Grid item xs={6}>
                    <MDBox mb={3}>
                      <FormControl sx={{ width: "100%" }}>
                        <MDInput
                          sx={{ height: "44.125px" }}
                          type="text"
                          labelId="demo-simple-select-label"
                          id="demo-simple-select"
                          name="access_code"
                          value={formdata.access_code}
                          label="Access Code"
                          fullWidth
                          onChange={handleChange}
                        />
                      </FormControl>
                    </MDBox>
                  </Grid>
                )}

                {/* categories */}

                <Grid item xs={6}>
                  <MDBox mb={3}>
                    <FormControl sx={{ width: "100%" }}>
                      <Autocomplete
                        multiple
                        id="tags-outlined-categories"
                        options={categoryData}
                        onChange={handleChangecategories}
                        value={countries}
                        ListboxProps={{
                          style: {
                            maxHeight: 200,
                            overflow: "scroll",
                          },
                        }}
                        getOptionLabel={(option) => option.title}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            variant="outlined"
                            label="Select Category"
                          />
                        )}
                      />
                    </FormControl>
                  </MDBox>
                </Grid>

                {/* regional_relevance */}

                <Grid item xs={6}>
                  <MDBox mb={3}>
                    <FormControl sx={{ width: "100%" }}>
                      <InputLabel id="demo-simple-select-label">
                        Regional Relevance
                      </InputLabel>
                      <Select
                        sx={{ height: "44.125px" }}
                        id="demo-simple-select"
                        name="regional_relevance"
                        value={formdata.regional_relevance}
                        label="Regional Relevance"
                        fullWidth
                        onChange={handleChange}
                      >
                        <MenuItem value="Local">Local</MenuItem>
                        <MenuItem value="Global">Global</MenuItem>
                      </Select>
                    </FormControl>
                  </MDBox>
                </Grid>

                {/* color */}

                <Grid item xs={6}>
                  <MDBox mb={3}>
                    <FormControl sx={{ width: "100%" }}>
                      <span className="color-picker">
                        <label
                          id="color-input"
                          htmlFor="colorPicker"
                          className="label-color"
                        >
                          <input
                            type="color"
                            value={formdata.color_code}
                            id="color-input"
                            name="color_code"
                            onChange={handleChange}
                          
                          />
                          <label htmlFor="user_name">Color</label>
                          <span className="color-text">
                            {formdata.color_code}{" "}
                          </span>
                        </label>
                      </span>
                    </FormControl>
                  </MDBox>
                </Grid> 

              
               

                {/* Country */}

                {formdata.regional_relevance === "Local" && (
                  <Grid item xs={6}>
                    <MDBox mb={3}>
                      <Autocomplete
                        id="tags-outlined"
                        multiple
                        options={countriesList}
                        value={country}
                        onChange={handleChangeAutocomplete}
                        getOptionLabel={(option) =>
                          "(" + option.country_code + ") " + option.name
                        }
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            variant="outlined"
                            label="Select Country"
                            placeholder={
                              country.length > 0 ? "" : "Select Country"
                            }
                          />
                        )}
                      />
                    </MDBox>
                  </Grid>
                )}

                {/* Search Tags */}
                <Grid item xs={6}>
                  <MDBox mb={3}>
                    <FormControl sx={{ width: "100%" }}>
                      <div className="input-tag">
                        <ul className="input-tag__tags label-name">
                          {tags.map((tag, i) => (
                            <li keys={tag} className="tag-chip">
                              {tag}
                              <button
                                type="button"
                                onClick={() => {
                                  removeTag(i);
                                }}
                              >
                                +
                              </button>
                            </li>
                          ))}
                          <li className="input-tag__tags__input">
                            <input
                              type="text"
                              onChange={inputKeyDown}
                              value={values}
                              className="input-search-form"
                              placeholder={tags.length > 0 ? "" : "Add Tags"}
                              onKeyDown={inputKeyDown}
                            />
                            <label htmlFor="user_name">Add Tags</label>
                          </li>
                        </ul>
                      </div>
                    </FormControl>
                  </MDBox>
                </Grid>

                {/* game_mode */}
                <Grid item xs={6}>
                  <MDBox mb={3}>
                    <FormControl sx={{ width: "100%" }}>
                      <InputLabel id="demo-simple-select-label">
                        Game Mode
                      </InputLabel>
                      <Select
                        sx={{ height: "44.125px" }}
                        id="demo-simple-select"
                        name="game_mode"
                        value={formdata.game_mode}
                        label="Game Mode"
                        fullWidth
                        disabled
                        onChange={handleChange}
                      >
                        <MenuItem value="Training">Training</MenuItem>
                        <MenuItem value="Tournament">Tournament</MenuItem>
                      </Select>
                    </FormControl>
                  </MDBox>
                </Grid>

                {/* match_format */}

                <Grid item xs={6}>
                  <MDBox mb={3}>
                    <FormControl sx={{ width: "100%" }}>
                      <InputLabel id="demo-simple-select-label">
                        Match Format
                      </InputLabel>
                      <Select
                        sx={{ height: "44.125px" }}
                        id="demo-simple-select"
                        name="match_format"
                        value={formdata.match_format}
                        label="Match Format"
                        fullWidth
                        onChange={handleChange}
                      >
                        <MenuItem value="Blitz">Blitz</MenuItem>
                        <MenuItem value="Classic">Classic</MenuItem>
                      </Select>
                    </FormControl>
                  </MDBox>
                </Grid>

                {/* number_of_questions */}

                <Grid item xs={6}>
                  <MDBox mb={3}>
                    <FormControl sx={{ width: "100%" }}>
                      <MDInput
                        sx={{ height: "44.125px" }}
                        type="number"
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        name="number_of_questions"
                        value={formdata.number_of_questions}
                        label="Number Of Questions"
                        fullWidth
                        min="0"
                        onChange={handleChange}
                      />
                    </FormControl>
                  </MDBox>
                </Grid>

                {/* Time For Question */}
                <Grid item xs={6}>
                  <MDBox mb={3}>
                    <FormControl sx={{ width: "100%" }}>
                      <MDInput
                        sx={{ height: "44.125px" }}
                        type="number"
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        name="time_for_question"
                        value={formdata.time_for_question}
                        label={
                          formdata.match_format === "Blitz"
                            ? "Seconds Per Question"
                            : "Seconds Per Match"
                        }
                        fullWidth
                        onChange={handleChange}
                      />
                    </FormControl>
                  </MDBox>
                </Grid>
                <Grid item xs={6}>
                  <MDBox mb={3} sx={{ width: "100%", display: "flex" }}>
                    <FormControl sx={{ width: "100%", display: "flex" }}>
                      <h6>Allow Bot</h6>
                      <FormControlLabel
                        control={
                          <Switch
                            onClick={() => setSwitchBot(!switchBot)}
                            checked={switchBot === true ? false : true}
                          />
                        }
                        label={switchBot === true ? "NO" : "YES"}
                      />
                    </FormControl>
                    <FormControl sx={{ width: "100%", display: "flex" }}>
                      <h6>Popular</h6>
                      <FormControlLabel
                        control={
                          <Switch
                            onClick={() => setPopular(!popular)}
                            checked={popular}
                          />
                        }
                        label={popular === true ? "YES" : "NO"}
                      />
                    </FormControl>
                    <FormControl sx={{ width: "100%", display: "flex" }}>
                      <h6>Featured</h6>
                      <FormControlLabel
                        control={
                          <Switch
                            onClick={() => setFeatured(!featured)}
                            checked={featured}
                          />
                        }
                        label={featured === true ? "YES" : "NO"}
                      />
                    </FormControl>
                  </MDBox>
                </Grid>
              </Grid>
              <MDBox mt={2}>
                <MDButton
                  onClick={handleSubmit}
                  variant="gradient"
                  color="info"
                  fullWidth
                >
                  Add
                </MDButton>
              </MDBox>
            </MDBox>
          </MDBox>
        </Box>
      </Modal>
    </>
  );
};

export default AddTopics;
