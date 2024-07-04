import React, { useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import Grid from "@material-ui/core/Grid";
import { Link } from "react-router-dom";
import NavBar from "./NavBar";
import cx from "clsx";

const useStyles = makeStyles((theme) => ({
  root: {
    // display: "flex",
    flexDirection: "column",
    // alignItems: "center",
    color: "#4c4c4c",
  },
  box: {
    margin: "0 auto",
    marginTop: "50px",
    paddingTop: "50px",
    width: "70%",
    paddingBottom: "50px",
    [theme.breakpoints.down("md")]: {
      width: "90%",
    },
  },

  title: {
    fontWeight: "800",
  },

  date: {
    marginTop: "25px",
    fontStyle: "italic",
  },

  border: {
    height: "1px",
    backgroundColor: "lightgray",
    margin: "10px 0",
  },

  heading: {
    margin: "20px 0 10px 0",
    fontWeight: "800",
    fontSize: "1.75rem",
  },

  link: {
    color: theme.palette.primary.main,
  },

  para: {
    "&:not(last-child)": { marginBottom: "10px" },
  },

  unorderedList: {
    paddingLeft: "30px",
  },

  underline: {
    textDecoration: "underline",
  },

  gridContainer: {
    border: "0.25px solid #4c4c4c",
    marginTop: "20px",
    marginBottom: "20px",
  },

  gridHeader: {
    fontWeight: "600",
    backgroundColor: "#e6e6e6",
  },

  gridColumn: {
    border: "0.25px solid #4c4c4c",
  },
}));

function Privacy() {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <NavBar />
      <div className={classes.box}>
        <Typography variant="h4" className={classes.title}>
          ContractFlo Privacy Policy
        </Typography>
        <Typography variant="body2" className={classes.date}>
          Effective Date: May 03, 2022
        </Typography>
        <div className={classes.border} />
        <Typography variant="body2">
          Thank you for using this service, which is owned and operated by
          ContractFlo, Inc (<strong>“ContractFlo,” “we,” “us,”</strong> and{" "}
          <strong>“our”</strong>). This Privacy Policy (this{" "}
          <strong>“Privacy Policy”</strong>) describes to you, or if you
          represent an entity or other organization, that entity or organization
          (in either case, <strong>“you,”</strong> or <strong>“your”</strong>)
          the personal information we collect from or about you, including
          through the ContractFlo-owned websites and mobile apps (collectively
          referred to as the <strong>"Site"</strong>). It also describes how we
          use and share that personal information and some of the steps we take
          to protect your privacy.
        </Typography>

        <Typography variant="h5" className={classes.heading}>
          1. SCOPE OF THIS PRIVACY POLICY
        </Typography>
        <Typography variant="body2">
          <p className={classes.para}>
            <span className={classes.underline}>1.1. Overview.</span>{" "}
            ContractFlo has provided this Privacy Policy so that you will know
            what personal information ContractFlo collects, how ContractFlo uses
            this personal information, the types of third parties with which
            ContractFlo may share this personal information, and some of the
            choices that are available to you.
          </p>
          <p className={classes.para}>
            <span className={classes.underline}>1.2. Privacy Notices.</span>{" "}
            This Privacy Policy may be supplemented or amended from time to time
            by additional privacy notices (“Privacy Notices”), provided at the
            time we collect your personal information. For example, certain
            pages of the Site may contain Privacy Notices providing more details
            about the personal information we collect on those particular pages,
            why we need that personal information, and choices you may have
            about the ways we use that personal information. In other cases,
            specific Privacy Notices may be required to comply with the privacy
            laws of one of the countries, provinces, or states in which we do
            business.
          </p>
        </Typography>

        <Typography variant="h5" className={classes.heading}>
          2. YOUR CONSENT
        </Typography>
        <Typography variant="body2">
          <p className={classes.para}>
            By using the Site, you are consenting to the collection, use,
            disclosure, and transfer of your personal information as described
            in this Privacy Policy (and any Privacy Notices that apply to you).
            If you do not consent to the collection, use, disclosure and
            transfer of your personal information as described in this Privacy
            Policy (and any Privacy Notices that apply to you), you may not use
            the Site. If you have questions about this Privacy Policy, or any
            Privacy Notice, please contact us as described below.
          </p>
        </Typography>

        <Typography variant="h5" className={classes.heading}>
          3. OUR TERMS OF USE
        </Typography>
        <Typography variant="body2">
          <p className={classes.para}>
            This Privacy Policy is part of the Terms of Use that govern your use
            of the Site. A link to our Terms of Use is provided at the bottom of
            each page of the Site. Any capitalized terms used and not expressly
            defined in this Privacy Policy will have the meanings given to them
            in the Terms of Use.
          </p>
        </Typography>

        <Typography variant="h5" className={classes.heading}>
          4. THIS PRIVACY POLICY MAY CHANGE
        </Typography>
        <Typography variant="body2">
          <p className={classes.para}>
            ContractFlo reserves the right to update or modify this Privacy
            Policy and any Privacy Notice, at any time and without prior notice,
            by posting the revised version of the Privacy Policy or Privacy
            Notice on the Site. These changes will only apply to the personal
            information we collect after we have posted the revised Privacy
            Policy or Privacy Notice on the Site. Your use of the Site following
            any such change constitutes your agreement that all personal
            information collected from or about you after the revised Privacy
            Policy is posted will be subject to the terms of the revised Privacy
            Policy. You may access the current version of this Privacy Policy at
            any time by clicking on the link marked “Privacy” at the bottom of
            each page of the public areas on the Site.
          </p>
        </Typography>

        <Typography variant="h5" className={classes.heading}>
          5. COLLECTION OF PERSONAL INFORMATION
        </Typography>
        <Typography variant="body2">
          <p className={classes.para}>
            <span className={classes.underline}>
              5.1. Personal Information.
            </span>{" "}
            “Personal information” means information that identifies, relates
            to, describes, is reasonably capable of being associated with, or
            could reasonably be linked to, directly or indirectly, a particular
            consumer or household. The following are categories (with
            non-exhaustive examples) of personal information we may collect
            about you and for each category the purpose for which it may be
            used:
          </p>

          <p className={classes.para}>
            <Grid
              container
              className={classes.gridContainer}
              spacing={2}
              align="center"
            >
              <Grid
                item
                xs={3}
                className={cx(classes.gridColumn, classes.gridHeader)}
              >
                Categories
              </Grid>
              <Grid
                item
                xs={5}
                className={cx(classes.gridColumn, classes.gridHeader)}
              >
                Examples
              </Grid>
              <Grid
                item
                xs={4}
                className={cx(classes.gridColumn, classes.gridHeader)}
              >
                Processing Purpose
              </Grid>

              <Grid item xs={3} className={classes.gridColumn}>
                A. Individual Identifiers and Demographic Information
              </Grid>
              <Grid item xs={5} className={classes.gridColumn}>
                A real name, alias, postal address, unique personal identifier,
                online identifier, Internet Protocol address, email address,
                account name, driver’s license number, passport number, or other
                similar identifiers. • To provide the information, products and
                services you request.
              </Grid>
              <Grid item xs={4} className={classes.gridColumn}>
                <ul className={classes.unorderedList}>
                  <li>To provide you with effective customer service.</li>
                  <li>
                    To provide you with a personalized experience when you use
                    the Site.
                  </li>
                  <li>
                    To contact you with information and notices related to your
                    use of the Site.
                  </li>
                  <li>
                    To contact you with special offers and other information we
                    believe will be of interest to you (in accordance with any
                    privacy preferences you have expressed to us).
                  </li>
                  <li>
                    To invite you to participate in surveys and provide Feedback
                    to us (in accordance with any privacy preferences you have
                    expressed to us).
                  </li>
                  <li>
                    To contact you about our own and third parties' goods and
                    services that may be of interest to you or that you may have
                    requested information about.
                  </li>
                  <li>
                    In any other way we may describe when you provide the
                    information.
                  </li>
                  <li>
                    To fulfill any other purpose for which you provide it.
                  </li>
                </ul>
              </Grid>

              <Grid item xs={3} className={classes.gridColumn}>
                B. Sensitive Personal Information
              </Grid>
              <Grid item xs={5} className={classes.gridColumn}>
                Health information, financial or credit/debit card account
                information, information about children, Social Security number,
                race/ethnicity, nationality, sexual orientation, political
                opinions, labor/trade union membership, religious or
                philosophical beliefs.
              </Grid>
              <Grid item xs={4} className={classes.gridColumn}>
                {" "}
              </Grid>

              <Grid item xs={3} className={classes.gridColumn}>
                C. Geolocation Data
              </Grid>
              <Grid item xs={5} className={classes.gridColumn}>
                Precise physical location or movements. precise, real-time
                location information from your mobile device
              </Grid>
              <Grid item xs={4} className={classes.gridColumn}>
                <ul className={classes.unorderedList}>
                  <li>To deliver tailored content through the Site.</li>
                </ul>
              </Grid>

              <Grid item xs={3} className={classes.gridColumn}>
                D. Biometric Information
              </Grid>
              <Grid item xs={5} className={classes.gridColumn}>
                Genetic, physiological, behavioral, and biological
                characteristics, or activity patterns used to extract a template
                or other identifier or identifying information, such as,
                fingerprints, faceprints, and voiceprints, iris or retina scans,
                keystroke, gait, or other physical patterns, and sleep, health,
                or exercise data.
              </Grid>
              <Grid item xs={4} className={classes.gridColumn}>
                <ul className={classes.unorderedList}></ul>
              </Grid>

              <Grid item xs={3} className={classes.gridColumn}>
                E. Sensory Data
              </Grid>
              <Grid item xs={5} className={classes.gridColumn}>
                Audio, electronic, visual, thermal, olfactory, or similar
                information.
              </Grid>
              <Grid item xs={4} className={classes.gridColumn}>
                <ul className={classes.unorderedList}> </ul>
              </Grid>

              <Grid item xs={3} className={classes.gridColumn}>
                F. Commercial Information
              </Grid>
              <Grid item xs={5} className={classes.gridColumn}>
                Records of personal property, products or services purchased,
                obtained, or considered, or other purchasing or consuming
                histories or tendencies.
              </Grid>
              <Grid item xs={4} className={classes.gridColumn}>
                <ul className={classes.unorderedList}> </ul>
              </Grid>

              <Grid item xs={3} className={classes.gridColumn}>
                G. Internet or Network Activity
              </Grid>
              <Grid item xs={5} className={classes.gridColumn}>
                IP address, the name of your operating system, the name and
                version of your browser, the date and time of your visit, and
                the pages you visit. In addition, we also collect Cookies and
                other online tracking technologies • To help us improve the Site
                and make it more compatible with the technology used by our
                visitors.
              </Grid>
              <Grid item xs={4} className={classes.gridColumn}>
                <ul className={classes.unorderedList}>
                  <li>To detect intrusions into our network.</li>
                  <li>
                    To support the features and functionality of the Site, for
                    example, to save you the trouble of reentering information
                    already in our database or to prompt the settings you
                    established on previous visits.
                  </li>
                  <li>To personalize your experience when you use the Site.</li>
                  <li>
                    To improve our marketing efforts, including through use of
                    targeted advertising.
                  </li>
                </ul>
              </Grid>

              <Grid item xs={3} className={classes.gridColumn}>
                H. Professional or Employment-Related Information
              </Grid>
              <Grid item xs={5} className={classes.gridColumn}>
                Information collected in connection with employment or
                application for employment, benefit information, title,
                employment history, education, job qualifications, current or
                past job history, performance evaluations, and other employee
                personal data.
              </Grid>
              <Grid item xs={4} className={classes.gridColumn}>
                <ul className={classes.unorderedList}> </ul>
              </Grid>

              <Grid item xs={3} className={classes.gridColumn}>
                I. Education Information
              </Grid>
              <Grid item xs={5} className={classes.gridColumn}>
                Education records directly related to a student maintained by an
                educational institution or party acting on its behalf, such as
                grades, transcripts, class lists, student schedules, student
                identification codes, student financial information, or student
                disciplinary records.
              </Grid>
              <Grid item xs={4} className={classes.gridColumn}>
                <ul className={classes.unorderedList}> </ul>
              </Grid>

              <Grid item xs={3} className={classes.gridColumn}>
                J. Inferences Drawn from Personal Information
              </Grid>
              <Grid item xs={5} className={classes.gridColumn}>
                Profile reflecting a person’s preferences, characteristics,
                psychological trends, predispositions, behavior, attitudes,
                intelligence, abilities, or aptitudes.
              </Grid>
              <Grid item xs={4} className={classes.gridColumn}>
                <ul className={classes.unorderedList}> </ul>
              </Grid>
            </Grid>
          </p>

          <p className={classes.para}>
            <span className={classes.underline}>
              5.2. Personal information does not include:
            </span>
          </p>

          <p className={classes.para}>
            <ul className={classes.unorderedList}>
              <li>
                Publicly Available Data. Publicly available information from
                government records.
              </li>
              <li>
                Deidentified or Aggregate Information. “Deidentified
                Information” means information that cannot reasonably identify,
                relate to, describe, be capable of being associated with, or be
                linked, directly or indirectly, to a particular individual, and
                for which ContractFlo has implemented technical safeguards and
                business processes that prohibit reidentification of the
                individual. “Aggregate Information” means information that
                relates to a group or category of individuals, from which
                individual identities have been removed, that is not linked or
                reasonably linkable to any individual or household, including
                via a device.
              </li>
              <li>
                • Excluded Information. Certain laws require separate privacy
                notices or are exempt from general personal information privacy
                policy disclosure requirements.
              </li>
            </ul>
          </p>
          <p className={classes.para}>
            <span className={classes.underline}>
              5.3. Sources of Personal Information.
            </span>{" "}
            We obtain the categories of personal information listed above on or
            through our Site from the following sources:
          </p>
          <p className={classes.para}>
            <ul className={classes.unorderedList}>
              <li>
                Personal Information You Manually Provide. ContractFlo collects
                personal information you manually provide (using your keyboard,
                mouse, or touchpad) when you use the Site. For example, we
                collect personal information you provide when you contact us
                with questions, express interest in advertising on the Site,
                register with the Site and create a profile, participate in a
                forum discussion, or otherwise interact with the Site.
              </li>
              <li>
                Personal Information From Third-Party Social Media Platforms.
                You may be able to register with, log on to, or enhance your
                profile on the Site by choosing to automatically populate the
                requested data fields with personal information you previously
                provided to a third-party social media platform (such as
                Facebook or Twitter). By doing this, you are asking the
                third-party platform to send us information, including personal
                information, from your profile on that platform. We treat that
                personal information as we do any other personal information you
                give to us when you register, log on, or enhance your profile.
              </li>
              <li>
                Automatically Collected Personal Information. ContractFlo
                collects personal information that is sent to us automatically
                by your web browser or mobile device. The personal information
                we receive may depend on your browser or device settings. We
                automatically collect personal information using GPS technology,
                and with your opt-in consent, we may also collect precise,
                real-time location information from your mobile device. Your
                mobile device may allow you to adjust your settings so that
                location information is not available to any mobile website or
                application. If you have questions about the security and
                privacy settings of your mobile or tablet device, please refer
                to instructions from your mobile service provider or the
                manufacturer of your device.
              </li>
              <li>
                Personal Information Collected by Cookies and Other Tracking
                Technologies. We collect some personal information automatically
                using cookies or other online tracking technologies. If you do
                not wish to receive cookies, you may set your browser to reject
                cookies or to alert you when a cookie is placed on your
                computer. Although you are not required to accept cookies when
                you visit the Site, you may be unable to use all of the
                functionality of the Site if your browser rejects our cookies.
                Cookies let us collect personal information about the way users
                use the Site, which pages they visit, which links they use, and
                how long they stay on each page.
              </li>
            </ul>
          </p>
        </Typography>

        <Typography variant="h5" className={classes.heading}>
          6. HOW WE USE PERSONAL INFORMATION
        </Typography>
        <Typography variant="body2">
          <p className={classes.para}>
            ContractFlo’ primary purpose in collecting personal information is
            to provide the Content. ContractFlo may also use personal
            information for various purposes, including without limitation:
          </p>
          <p className={classes.para}>
            <ul className={classes.unorderedList}>
              <li>
                To provide the information, products, and services you request.
              </li>
              <li>To provide you with effective customer service.</li>
              <li>
                To provide you with a personalized experience when you use the
                Site.
              </li>
              <li>
                To contact you with information and notices related to your use
                of the Site.
              </li>
              <li>
                To contact you with special offers and other information we
                believe will be of interest to you (in accordance with any
                privacy preferences you have expressed to us).
              </li>
              <li>
                To invite you to participate in surveys and provide feedback to
                us (in accordance with any privacy preferences you have
                expressed to us).
              </li>
              <li>
                To improve the content, functionality, and usability of the
                Site.
              </li>
              <li>
                To support the features and functionality of the Site. For
                example, to save you the trouble of reentering information
                already in our database or to prompt the settings you
                established on previous visits.
              </li>
              <li>
                o help us improve the Site and make it more compatible with the
                technology used by our visitors.
              </li>
              <li>To detect intrusions into our network.</li>
              <li>To better understand your needs and interests</li>
              <li>To improve our products and services.</li>
              <li>
                To improve our marketing and promotional efforts, including
                through use of targeted advertising.
              </li>
              <li>To keep the Site free by selling advertisements.</li>
              <li>For security, credit or fraud prevention purposes.</li>
              <li>
                For any other purpose identified in an applicable Privacy
                Notice, click-through agreement or other agreement between you
                and us.
              </li>
              <li>
                To contact you about our own and third parties' goods and
                services that may be of interest to you or that you may have
                requested information about.
              </li>
              <li>
                In any other way we may describe when you provide the
                information.
              </li>
              <li>To fulfill any other purpose for which you provide it.</li>
              <li>For any other purpose with your consent.</li>
            </ul>
          </p>
        </Typography>

        <Typography variant="h5" className={classes.heading}>
          7. HOW WE SHARE PERSONAL INFORMATION
        </Typography>
        <Typography variant="body2">
          <p className={classes.para}>
            In addition to the specific situations discussed elsewhere in this
            Privacy Policy or in a Privacy Notice, ContractFlo’ may share your
            personal information in the following circumstances:
          </p>
          <p className={classes.para}>
            <span className={classes.underline}>
              7.1. With Third–Party Vendors.
            </span>{" "}
            iggerPockets shares personal information collected through the Site
            with third-party vendors who act for us or on our behalf. For
            example, we may use third-party vendors to design and operate the
            Site; to conduct surveys; and to help us with our promotional
            efforts. These third-party vendors may need personal information
            about you to perform their functions. Additionally, we will share
            your personal information with third-party vendors when you request
            us to do so. For instance, you may request that we provide your
            personal information to hard money lenders so that you may receive
            information about offers and rates.
          </p>
          <p className={classes.para}>
            <span className={classes.underline}>
              7.2. With Other Users of the Site.
            </span>{" "}
          </p>
          <p className={classes.para}>
            <span className={classes.underline}></span> One of the Site’s goals
            is to provide tools and resources to enhance real estate knowledge,
            networking, dealmaking, and marketing. Thus, User-Generated Content
            you post on the Site can be read, collected, and used by others. (In
            this Privacy Policy, “User-Generated Content” or “UGC” refers to
            your publicly available profile information and all Content that you
            post using the social networking tools we make available to you. UGC
            does not include Feedback. In addition, we may feature you and your
            activity on the Site on our “stats” page at
            http://www.contractflo.com/stats or on our newsletter or via other
            automated emails to our members. For example, if you visit the
            profile or click on an ad of a Pro member, we may notify the Pro
            member of your interest so he/she can reach out to you. We may also
            use UGC you submit for advertising campaigns and other promotions.
            We may or may not use your name in connection with such use, and we
            may or may not seek your consent before using the Content for such
            purposes. You should have no expectation of privacy with respect to
            UGC you submit on or through the Site. In addition, we may also
            share personal information about your location with your friends and
            other contacts, to the extent you interact with them using the
            social networking tools available on the Site.
          </p>
          <p className={classes.para}>
            <span className={classes.underline}>
              7.3. With Third-Party Social Media Platforms.
            </span>{" "}
            We may provide functionality on the Site that allows you to
            automatically post personal information about the actions you take
            on the Site to a third-party social media platform (such as Facebook
            or Twitter). If you choose to take advantage of this functionality,
            people with access to your profile on the third-party platform may
            be able to see the actions you have taken—for example, the items you
            have purchased. Thus, you should have no expectation of privacy in
            those actions. Further, if you choose to link your profile on the
            Site with an account on a third-party social media platform, we may
            share the personal information in your profile with that third-party
            platform. We may share or provide some of your personal information,
            such as an email address, to third-party social media platforms so
            that we can identify you in order to engage with you on those
            platforms.
          </p>
          <p className={classes.para}>
            <span className={classes.underline}>7.4. With Our Affiliates.</span>{" "}
            ContractFlo may share the personal information collected through the
            Site with other ContractFlo entities, such as ContractFlo
            Publishing, Inc. These affiliate companies are permitted to use your
            personal information for their own marketing purposes and in a
            manner otherwise consistent with this Privacy Policy.
          </p>
          <p className={classes.para}>
            <span className={classes.underline}>
              7.5. With Other, Carefully Selected Business Partners.
            </span>{" "}
            From time to time, we may share your personal information with
            selected third parties for their own marketing purposes. For
            example, we may partner with third parties to sponsor contests or
            other promotions, and we may share with these third parties the
            personal information you submit to us to participate in the contest
            or take advantage of the promotion. Before doing so, however, we may
            offer you the opportunity to “opt out” or “opt in,” as required by
            applicable law.
          </p>
          <p className={classes.para}>
            <span className={classes.underline}>
              7.6. In Deidentified or Aggregate Form.
            </span>{" "}
            We use personal information collected through the Site to create a
            compiled, aggregate view of usage patterns. We may share
            Deidentified Information or Aggregate Information with third parties
            so they can better understand our user base. We may also share with
            third parties Deidentified Information or Aggregate Information
            about how particular individuals use the Site. Deidentified
            Information or Aggregate Information is not personally identifiable,
            but it does reflect the usage patterns of a particular Site user, as
            opposed to Site users collectively. We may provide basic demographic
            information (gender and age) in conjunction with providing
            Deidentified Information or Aggregate Information in accordance with
            this Privacy Policy. Third parties typically use this information
            for analytical purposes.
          </p>
          <p className={classes.para}>
            <span className={classes.underline}>
              7.7. As Part of a Business Transfer.
            </span>{" "}
            Your personal information may be transferred to successor
            organization if, for example, we transfer the ownership or operation
            of the Site to another organization or if we merge with another
            organization. If such a transfer occurs, the successor
            organization’s use of your personal information will still be
            subject to this Privacy Policy and the privacy preferences you have
            expressed to us.
          </p>
          <p className={classes.para}>
            <span className={classes.underline}>
              7.8. To Comply with Laws and Protect Our Rights and the Rights of
              Others.
            </span>{" "}
            We may disclose your personal information when we, in good faith,
            believe disclosure is appropriate to comply with the law, a court
            order or a subpoena. We may also disclose your personal information
            to prevent or investigate a possible crime, such as fraud or
            identity theft; to protect the security of the Site; to enforce or
            apply our online Terms of Use or other agreements; or to protect our
            own rights or property or the rights, property or safety of our
            users or others.
          </p>
          <p className={classes.para}>
            <span className={classes.underline}>
              7.9. As Described in a Privacy Notice or Click-Through Agreement.
            </span>{" "}
            We reserve the right to disclose your personal information as
            described in any Privacy Notice posted on a page of the Site where
            you provide that personal information. By providing your personal
            information on that page you will be consenting to the disclosure of
            your personal information as described in that Privacy Notice. We
            also reserve the right to disclose your personal information as
            described in any click–through agreement to which you have agreed.
          </p>
        </Typography>

        <Typography variant="h5" className={classes.heading}>
          8. HOW WE PROTECT YOUR INFORMATION
        </Typography>
        <Typography variant="body2">
          <p className={classes.para}>
            ContractFlo takes reasonable precautions to provide a level of
            security appropriate to the sensitivity of the personal information
            we collect. Although we use reasonable measures to help protect your
            personal information against unauthorized use or disclosure, we
            cannot guarantee the security of personal information provided over
            the Internet or stored in our databases. In the event that we are
            required by law to inform you of any unauthorized access or
            acquisition of your personal information we may notify you
            electronically, in writing, or by telephone, if permitted to do so
            by law.
          </p>
        </Typography>

        <Typography variant="h5" className={classes.heading}>
          9. INFORMATION ABOUT THIRD-PARTY COOKIES
        </Typography>
        <Typography variant="body2">
          <p className={classes.para}>
            <span className={classes.underline}>
              9.1. Third Party Cookies.{" "}
            </span>{" "}
            In addition to the cookies ContractFlo delivers to your computer or
            mobile device through the Site, certain third parties may deliver
            cookies to you for a variety of reasons. For example, we may use
            Google Analytics, including the following Google Analytics
            Advertising Features: Adsense, Adwords, Doubleclick, Remarketing. To
            learn more about Google Analytics,{" "}
            <a
              href="https://support.google.com/analytics/answer/9019185?hl=en#zippy=%2Cin-this-article"
              className={classes.link}
            >
              click here
            </a>
            . Please note that the Google Analytics opt-out browser add-on does
            not prevent personal information from being sent to ContractFlo.
          </p>

          <p className={classes.para}>
            <span className={classes.underline}>
              9.2. Behavioral Based Advertising.
            </span>{" "}
            Other third parties may also deliver cookies to your computer or
            mobile device for the purpose of tracking your online behaviors
            across non-affiliated websites and delivering targeted
            advertisements either on the Site or on other websites.
          </p>
          <p className={classes.para}>
            <span className={classes.underline}>9.3. Mobile App Opt Out. </span>{" "}
            The Website Opt Out described above only works on websites. To opt
            out of having participating entities track your behaviors for
            advertising purposes when you are using our mobile apps, download
            and use the Digital Advertising Alliance's "App Choices" app. As
            with the Website Opt Out, the "Mobile App Opt Out" prevents tracking
            only by participating entities.
          </p>
          <p className={classes.para}>
            <span className={classes.underline}>
              9.4. Opt Out is Device Specific.
            </span>{" "}
            Please note that the Website Opt Out and Mobile App Opt Out are
            device specific. If you wish to opt-out from having interest-based
            information collected by participating entities across all devices,
            you need to take the steps outlined above from each device.
          </p>
        </Typography>

        <Typography variant="h5" className={classes.heading}>
          10. OPTING OUT
        </Typography>
        <Typography variant="body2">
          <p className={classes.para}>
            In addition to the rights you have listed above, with respect to
            opting out of third party cookies, you also can make the following
            choices to opt out of certain activities regarding your personal
            information:
          </p>
          <p className={classes.para}>
            <span className={classes.underline}>
              10.1. Promotional E-mails.
            </span>{" "}
            You may choose to provide us with your e-mail address for the
            purpose of allowing us to send newsletters, surveys, offers, and
            other promotional materials, as well as targeted offers from third
            parties. You can stop receiving promotional e-mails by clicking the
            “unsubscribe” links in the e-mails or by contacting us as described
            below. If you decide not to receive promotional e-mails, we may
            still send you service-related communications, such as those about
            your account, to fulfill orders for products and service you have
            requested, or deliver notifications directly to you through the
            Site.
          </p>
          <p className={classes.para}>
            <span className={classes.underline}>10.2. Do-Not-Track. </span> Some
            web browsers and devices permit you to broadcast a “Do-Not-Track
            (“DNT”) preference. Because of the changing state of technology and
            indecision within the industry regarding the meaning of DNT signals,
            we currently do not make any guarantee that we will honor DNT
            signals.
          </p>
        </Typography>

        <Typography variant="h5" className={classes.heading}>
          11. YOUR CHOICES
        </Typography>
        <Typography variant="body2">
          <p className={classes.para}>
            <span className={classes.underline}>11.1. In General. </span> We
            respect your right to make choices about the ways we collect, use,
            and disclose your personal information. We may ask you to indicate
            your choices at the time and on the page where you provide your
            personal information. In other situations, and consistent with the
            Site’s purpose as a networking platform, we make certain assumptions
            about how you want your personal information shared with others.
            However, you can view and change certain default privacy settings at
            https://www.contractflo.com/settings. Otherwise, you can contact us
            as described below.
          </p>
          <p className={classes.para}>
            <span className={classes.underline}>
              11.2. Access and Changes to Your Personal Information.
            </span>{" "}
            If you would like to review, correct and update the personal
            information you have provided to us through the Site, you may be
            able to do so at https://www.contractflo.com/profile/basics.
            Otherwise, please contact us as described below. We will respond to
            your request within the time limit set out by the applicable privacy
            legislation. We will use reasonable efforts to comply with your
            request as required by applicable law.
          </p>
          <p className={classes.para}>
            <span className={classes.underline}>
              11.3. Retention and Deletion of Personal Information.
            </span>{" "}
            ContractFlo retains the personal information collected on the Site
            as long as necessary to provide the services, products and
            information you request or as permitted by applicable law. You may,
            however, request that we delete your personal information by
            contacting us contacting us as described below. We will grant a
            request to delete information as required by law, but you should
            note that in many situations we must keep your personal information
            to comply with our legal obligations, resolve disputes, enforce our
            agreements, or for another one of our business purposes. Except as
            provided above, we will delete, aggregate, or de-identify all of
            your personal information as described in this subsection within the
            timeframes required by law.
          </p>
        </Typography>

        <Typography variant="h5" className={classes.heading}>
          12. RESIDENTS OF CALIFORNIA
        </Typography>
        <Typography variant="body2">
          <p className={classes.para}>
            The following applies residents of California:
          </p>
          <p className={classes.para}>
            <span className={classes.underline}>
              12.1. Notice to California Residents.
            </span>{" "}
            ContractFlo must disclose whether the following categories of
            personal information are disclosed for a “business purpose” or
            “valuable consideration” as those terms are defined under California
            law. Note that while a category below may be marked, that does not
            necessarily mean that we have personal information in that category
            about you. In the preceding twelve months, we have disclosed the
            following categories of personal information in the manner
            described.
          </p>

          <Grid
            container
            className={classes.gridContainer}
            spacing={2}
            align="left"
          >
            <Grid
              item
              align="center"
              xs={4}
              className={cx(classes.gridColumn, classes.gridHeader)}
            >
              Category
            </Grid>
            <Grid
              item
              align="center"
              xs={4}
              className={cx(classes.gridColumn, classes.gridHeader)}
            >
              Personal Information is Disclosed for a Business Purpose
            </Grid>
            <Grid
              item
              align="center"
              xs={4}
              className={cx(classes.gridColumn, classes.gridHeader)}
            >
              Personal Information is Disclosed for Valuable Consideration
            </Grid>

            <Grid item xs={4} className={classes.gridColumn}>
              A. Individual Identifiers and Demographic Information
            </Grid>
            <Grid item xs={4} className={classes.gridColumn}>
              Yes
            </Grid>
            <Grid item xs={4} className={classes.gridColumn}>
              No
            </Grid>

            <Grid item xs={4} className={classes.gridColumn}>
              B. Sensitive Personal Information
            </Grid>
            <Grid item xs={4} className={classes.gridColumn}></Grid>
            <Grid item xs={4} className={classes.gridColumn}></Grid>

            <Grid item xs={4} className={classes.gridColumn}>
              C. Geolocation Data
            </Grid>
            <Grid item xs={4} className={classes.gridColumn}>
              Yes
            </Grid>
            <Grid item xs={4} className={classes.gridColumn}>
              No
            </Grid>

            <Grid item xs={4} className={classes.gridColumn}>
              D. Biometric Information
            </Grid>
            <Grid item xs={4} className={classes.gridColumn}></Grid>
            <Grid item xs={4} className={classes.gridColumn}></Grid>

            <Grid item xs={4} className={classes.gridColumn}>
              E. Sensory Data
            </Grid>
            <Grid item xs={4} className={classes.gridColumn}></Grid>
            <Grid item xs={4} className={classes.gridColumn}></Grid>

            <Grid item xs={4} className={classes.gridColumn}>
              F. Commercial Information
            </Grid>
            <Grid item xs={4} className={classes.gridColumn}></Grid>
            <Grid item xs={4} className={classes.gridColumn}></Grid>

            <Grid item xs={4} className={classes.gridColumn}>
              G. Internet of Network Activity
            </Grid>
            <Grid item xs={4} className={classes.gridColumn}>
              Yes
            </Grid>
            <Grid item xs={4} className={classes.gridColumn}>
              No
            </Grid>

            <Grid item xs={4} className={classes.gridColumn}>
              H. Professional or Employment-Related Information
            </Grid>
            <Grid item xs={4} className={classes.gridColumn}></Grid>
            <Grid item xs={4} className={classes.gridColumn}></Grid>

            <Grid item xs={4} className={classes.gridColumn}>
              I. Education Information
            </Grid>
            <Grid item xs={4} className={classes.gridColumn}></Grid>
            <Grid item xs={4} className={classes.gridColumn}></Grid>

            <Grid item xs={4} className={classes.gridColumn}>
              J. Inferences Drawn from Personal Information
            </Grid>
            <Grid item xs={4} className={classes.gridColumn}>
              Yes
            </Grid>
            <Grid item xs={4} className={classes.gridColumn}>
              No
            </Grid>
          </Grid>

          <Typography variant="body2">
            <p className={classes.para}>
              <span className={classes.underline}>
                12.2. Notice of Disclosure for Direct Marketing.
              </span>{" "}
              Under California Civil Code sections 1798.83-1798.84, California
              residents who have an established business relationship with
              ContractFlo are entitled to ask us for a notice describing what
              categories of personal information we share with third parties for
              their direct marketing purposes. This notice will identify the
              categories of information shared with and will include a list of
              the third parties with which it is shared, along with their names
              and addresses. If you are a California resident and would like a
              copy of this notice, please submit your request to the address
              listed below.
            </p>
          </Typography>
        </Typography>

        <Typography variant="h5" className={classes.heading}>
          13. EXERCISING YOUR PRIVACY RIGHTS
        </Typography>
        <Typography variant="body2">
          <p className={classes.para}>
            When exercising the rights or options described in this Privacy
            Policy, the following guidelines apply:
          </p>
          <p className={classes.para}>
            <span className={classes.underline}>
              13.1. No Fee Usually Required.
            </span>{" "}
            You will not have to pay a fee to access your personal information
            (or to exercise any of the other rights). However, we may charge a
            reasonable fee or decline to comply with your request if your
            request is clearly unfounded, repetitive, or excessive.
          </p>
          <p className={classes.para}>
            <span className={classes.underline}>
              13.2. What We May Need from You.
            </span>{" "}
            When exercising your rights or otherwise assisting you, we may need
            to request specific information from you to help us confirm your
            identity. This is a security measure to ensure we do not disclose
            personal information to any person who is not entitled to receive
            it. We may also contact you to ask you for further information in
            relation to your request to speed up our response.
          </p>
          <p className={classes.para}>
            <span className={classes.underline}>13.3. Time to Respond.</span> We
            try to respond to all legitimate requests within 45 days of your
            request. Occasionally it may take us longer than 45 days to respond,
            for instance if your request is particularly complex or you have
            made a number of requests. In this case, we will notify you of the
            delay, and may continue to update you regarding the progress of our
            response.
          </p>
          <p className={classes.para}>
            <span className={classes.underline}>13.4. No Discrimination.</span>{" "}
            You will not be subject to discrimination as a result of exercising
            the rights described herein. In some cases, when you exercise one of
            your rights, we will be unable to comply with the request due to
            legal obligations or otherwise, or we will be unable to provide you
            certain products or services. These responses are not discrimination
            and our reasons for declining your request or ceasing services will
            be provided at that time.
          </p>
          <p className={classes.para}>
            <span className={classes.underline}>13.5. Authorized Agent.</span>{" "}
            ou may designate an authorized agent to make a request on your
            behalf. In order to designate an authorized agent to make a request
            on your behalf, you must provide a valid power of attorney, the
            requester’s identification information, and the authorized agent’s
            identification information.
          </p>
        </Typography>

        <Typography variant="h5" className={classes.heading}>
          14. LINKS TO OTHER WEBSITES
        </Typography>
        <Typography variant="body2">
          <p className={classes.para}>
            The Site may contain links to websites that are not operated by
            ContractFlo or its affiliates. These links are provided for your
            reference and convenience only and do not imply any endorsement of
            the products sold or information provided through these websites,
            nor any association with their operators. ContractFlo does not
            control these websites and is not responsible for their data
            practices. Any personal information you provide to third parties on
            their websites is covered under their privacy and data collection
            policies and is not covered by this Privacy Policy. We urge you to
            review the privacy policy posted on any other website you visit
            before using that website or providing any personal information.
          </p>
        </Typography>

        <Typography variant="h5" className={classes.heading}>
          15. THE SITE IS HOSTED ON SERVERS LOCATED IN THE UNITED STATES
        </Typography>
        <Typography variant="body2">
          <p className={classes.para}>
            ContractFlo is a U.S. corporation. The servers that support the Site
            are located in the United States. While it is in our possession,
            your personal information will generally be stored in ContractFlo
            databases or databases maintained by our third-party service
            providers on servers and data storage devices located in the United
            States. U.S. data protection laws may not provide as much protection
            as the data protection laws in force in some other countries,
            however, we will process your personal information in accordance
            with this Privacy Policy no matter where our data is stored. If you
            are located in a country outside the United States, by using the
            Site you consent to the transfer of your personal information to the
            United States.
          </p>
        </Typography>

        <Typography variant="h5" className={classes.heading}>
          16. CONTACT US
        </Typography>
        <Typography variant="body2">
          <p className={classes.para}>
            If you have questions or concerns about this Privacy Policy, any
            Privacy Notice, or ContractFlo’ data practices, please contact us
            at:
          </p>
          <p className={classes.para}>
            ContractFlo, Inc
            <br />
            Attn: ContractFlo Privacy Agent
            <br />
            3344 Walnut St.
            <br />
            Denver, CO 80205
            <br />
            Email: legal@contractflo.com
          </p>
          <p className={classes.para}>
            To exercise your choices or opt out rights as described in this
            Privacy Policy, please use the following web form:{" "}
            <Link to="/privacy" className={classes.underline}>
              https://www.contractflo.com/contact-us
            </Link>
          </p>
        </Typography>
      </div>
    </div>
  );
}

export default Privacy;
