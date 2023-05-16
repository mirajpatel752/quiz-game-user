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

const EditTopic = (props) => {
  const {
    open,
    onClose,
    onConfirmClose,
    categoryData,
    editData,
    getViewFileFormat,
    flag,
  } = props;
  const { encryptData, decryptData } = useEncryption();
  const [tags, setTags] = React.useState([]);
  const [countriesList, setCountriesList] = useState([]);
  const [countries, setCountries] = useState();
  const [regionsData, setRegionsData] = useState([]);
  const [values, setValues] = useState("");
  const [country, setCountry] = useState([]);
  const [switchBot, setSwitchBot] = useState(true);

  const navigate = useNavigate();

  const [formdata, setFormData] = useState({
    name: "",
    description: "",
    access: "",
    color_code: "",
    regional_relevance: "",
    id: "",
    game_mode: "Training",
    match_format: "Blitz",
    time_for_question: 20,
    number_of_questions: 7,
    access_code: "",
  });

  const [preview, setPreview] = useState([]);
  const [logo, setLogo] = useState();
  const [popular, setPopular] = useState(false);
  const [featured, setFeatured] = useState(false);

  useEffect(() => {
    if (editData) {
      setFormData({
        ...formdata,
        name: editData.name,
        description: editData.description,
        access: editData.access,
        color_code: editData.color_code,
        regional_relevance: editData.regional_relevance,
        id: editData.id,
        match_format: editData.match_format,
        number_of_questions: editData.number_of_questions,
        time_for_question: editData.time_for_question,
        access_code: editData.access_code,
        game_mode: editData.game_mode,
      });
      editData.icon && setPreview(editData.icon);
      editData.search_tags && setTags(JSON.parse(editData.search_tags));
      editData.topic_countries_relevance &&
        setCountry(editData.topic_countries_relevance);
      editData.topic_categories && setCountries(editData?.topic_categories);
      if (editData?.topic_country?.id) {
        getRegions(editData?.topic_country?.id);
      }
      setSwitchBot(editData.allow_bot === 0 ? false : true);
      setPopular(editData.is_popular === 0 ? false : true);
      setFeatured(editData.is_featured === 0 ? false : true);
    }
  }, []);



  const removeTag = (i) => {
    const newTags = [...tags];
    newTags.splice(i, 1);
    setTags(newTags);
    setFormData({
      ...formdata,
      ["search_tags"]: newTags,
    });
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
  // onChange
  var regexp = /^[ A-Za-z0-9]*$/;
  var space = /^\S*$/;
  const handleChange = (event) => {
    const { name, value } = event.target;
    if (value.toLocaleLowerCase() === "classic") {
      setFormData({
        ...formdata,
        number_of_questions: 10,
        time_for_question: 180,
        [name]: value,
      });
    }  else if (name === "name") {
      if (value) {
        setFormData({
          ...formdata,
          [name]: value.slice(0, 120),
        });
      } else {
        setFormData({
          ...formdata,
          [name]: value.slice(0,120),
        });
      }
    }
     else if (value === "Blitz") {
      setFormData({
        ...formdata,
        number_of_questions: 7,
        time_for_question: 20,
        [name]: value,
      });
    } else if (name === "number_of_questions" || name === "time_for_question") {
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
        [name]: value,
      });
    }
  };

  const counters = countries && countries.map((d, i) => d.id);
  const countriesRingiFied = JSON.stringify(counters);

  const stringicountry = country && country.map((d, i) => d.id);
  const fiedCountry = JSON.stringify(stringicountry);
  const stringifiedsearch_tags = JSON.stringify(tags);

  const handleSubmit = async () => {
    if (formdata.name.length === 0) {
      toast.error("Please Enter your name ");
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
            categories: countriesRingiFied,
            countries: "",
            search_tags: stringifiedsearch_tags,
            id: formdata.id,
            access_code:
              formdata.access === "Closed" ? formdata.access_code : "",

            game_mode: formdata.game_mode,
            time_for_question: formdata.time_for_question,
            match_format: formdata.match_format,
            number_of_questions: formdata.number_of_questions,
            allow_bot: switchBot === true ? 1 : 0,
            is_featured: featured === true ? 1 : 0,
            is_popular: popular === true ? 1 : 0,
          })
        );
        const formData = new FormData();
        formData.append("data", encrypt);
        logo && formData.append("file", logo);
        await axiosInstanceAuth
          .put(`/admin/topics/edit`, formData)
          .then((res) => {
            if (res.data.status) {
              toast.success(res.data.message);
              onConfirmClose();
              getViewFileFormat();
              setLogo();
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
            categories: countriesRingiFied,
            countries: fiedCountry,
            search_tags: stringifiedsearch_tags,
            id: formdata.id,
            access_code:
              formdata.access === "Closed" ? formdata.access_code : "",
            game_mode: formdata.game_mode,
            time_for_question: formdata.time_for_question,
            match_format: formdata.match_format,
            number_of_questions: formdata.number_of_questions,
            allow_bot: switchBot === true ? 1 : 0,
            is_featured: featured === true ? 1 : 0,
            is_popular: popular === true ? 1 : 0,
          })
        );

        const formData = new FormData();
        formData.append("data", encrypt);
        logo && formData.append("file", logo);
        await axiosInstanceAuth
          .put(`/admin/topics/edit`, formData)
          .then((res) => {
            if (res.data.status) {
              toast.success(res.data.message);
              onConfirmClose();
              getViewFileFormat();
              setLogo();
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
          setCountriesList(data.data);
        } else {
          if (!res?.data?.isAuth) {
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

  const getRegions = async (id) => {
    await axiosInstanceAuth
      .get(`admin/regions/get/${id}`)
      .then((res) => {
        const data = decryptData(res.data.data);
        if (data.status) {
          setRegionsData(data.data);
        } else {
          toast.error(data?.message);
          if (!res?.data?.isAuth) {
            navigate("/sign-in");
          }
        }
      })
      .catch((err) => {
        setRegionsData([]);
        console.log(err);
      });
  };

  const handleChangeAutocomplete = (event, value) => {
    setCountry(value);
  };
  function removeDuplicates(arr) {
    const uniqueIds = [];
    const unique = arr.filter((element) => {
      const isDuplicate = uniqueIds.includes(element.id);
      if (!isDuplicate) {
        uniqueIds.push(element.id);
        return true;
      }
      return false;
    });
    return unique;
  }
  const handleChangecategories = (event, value) => {
    setCountries(removeDuplicates(value));
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
    <Modal
      open={open}
      onClose={onCloseEditModal}
      sx={modal}
      className="modal-scroll"
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
            {flag === true ? "View Topics" : "Edit Topics"}{" "}
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
                      <img htmlFor="photo-upload" src={preview} alt="" />
                    </div>
                    <input
                      id="photo-upload"
                      type="file"
                      accept="image/*"
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
                    disabled={flag}
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
              rowSpacing={1}
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
                      className="input-box"
                      value={formdata.name}
                      disabled={flag}
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
                    disabled={flag}
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
                      disabled={flag}
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
                        disabled={flag}
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
                      disabled={flag}
                      onChange={handleChangecategories}
                      value={countries}
                      // defaultValue={
                      //     editData.topic_categories
                      // }
                      ListboxProps={{
                        style: {
                          maxHeight: 200,
                          overflow: "auto",
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
                      disabled={flag}
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
                      <label htmlFor="colorPicker" className="label-color">
                        <input
                          type="color"
                          value={formdata.color_code}
                          disabled={flag}
                          id="color_code"
                          name="color_code"
                          onChange={handleChange}
                        />
                        <label htmlFor="user_name">Color</label>
                        <span className="color-text">
                          {formdata.color_code}
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
                      options={countriesList}
                      multiple
                      onChange={handleChangeAutocomplete}
                      defaultValue={editData.topic_country}
                      disabled={flag}
                      value={country}
                      getOptionLabel={(option) => option.name}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          variant="outlined"
                          label="Select Country"
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
                              disabled={flag}
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
                            disabled={flag}
                            className="input-search-form"
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
                      disabled={flag}
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
                      className="input-box"
                      label="Number Of Questions"
                      fullWidth
                      disabled={flag}
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
                      className="input-box"
                      labelId="demo-simple-select-label"
                      id="demo-simple-select"
                      name="time_for_question"
                      value={formdata.time_for_question}
                      label={
                        formdata.match_format === "Blitz"
                          ? "Seconds Per Question"
                          : "Seconds Per Match"
                      }
                      disabled={flag}
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
                          checked={switchBot}
                          disabled={flag}
                        />
                      }
                      label={switchBot === true ? "YES" : "NO"}
                    />
                  </FormControl>
                  <FormControl sx={{ width: "100%", display: "flex" }}>
                    <h6>Popular</h6>
                    <FormControlLabel
                      control={
                        <Switch
                          onClick={() => setPopular(!popular)}
                          checked={popular}
                          disabled={flag}
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
                          disabled={flag}
                        />
                      }
                      label={featured === true ? "YES" : "NO"}
                    />
                  </FormControl>
                </MDBox>
              </Grid>
            </Grid>

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
      </Box>
    </Modal>
  );
};

export default EditTopic;
