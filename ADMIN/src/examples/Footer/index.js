import PropTypes from "prop-types";
import Link from "@mui/material/Link";
import Icon from "@mui/material/Icon";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import typography from "assets/theme/base/typography";
function Footer({ company, links }) {
    const { href, name } = company;
    const { size } = typography;


    return (
        <MDBox className='footer_wrapper' width="fit-content" display="flex"
            flexDirection={
                {
                    xs: "column",
                    lg: "row"
                }
            }
            justifyContent="space-between"
            alignItems="center"
            px={1.5}>
            <MDBox display="flex" justifyContent="center" alignItems="center" flexWrap="wrap" color="text"
                fontSize={
                    size.sm
                }
                px={1.5}>
                &copy; {
                    new Date().getFullYear()
                }, made with  by .
                <MDBox fontSize={
                    size.md
                }
                    color="text"
                    mb={-0.5}
                    mx={0.25}>
                    <Icon color="inherit" fontSize="inherit">
                        favorite
                    </Icon>&nbsp;
                </MDBox>
                by
                <Link href={href}
                    target="_blank">
                    <MDTypography variant="button" fontWeight="medium">
                        &nbsp;{name}&nbsp;
                    </MDTypography>
                </Link>
            </MDBox>
            <MDBox component="ul"
                sx={
                    ({ breakpoints }) => ({
                        display: "flex",
                        flexWrap: "wrap",
                        alignItems: "center",
                        justifyContent: "center",
                        listStyle: "none",
                        mt: 3,
                        mb: 0,
                        p: 0,

                        [breakpoints.up("lg")]: {
                            mt: 0
                        }
                    })
                }>
            </MDBox>
        </MDBox>
    );
}

Footer.defaultProps = {
    company: {
        href: "https://sapientcodelabs.com/",
        name: "Sapientcodelabs"
    },
    links: [
        {
            href: "https://www.creative-tim.com/",
            name: "Creative Tim"
        }, {
            href: "https://www.creative-tim.com/presentation",
            name: "About Us"
        }, {
            href: "https://www.creative-tim.com/blog",
            name: "Blog"
        }, {
            href: "https://www.creative-tim.com/license",
            name: "License"
        },
    ]
};

Footer.propTypes = {
    company: PropTypes.objectOf(PropTypes.string),
    links: PropTypes.arrayOf(PropTypes.object)
};

export default Footer;
