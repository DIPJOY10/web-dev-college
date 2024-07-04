import React, { useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import { Link } from "react-router-dom";
import NavBar from "./NavBar";

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
}));

function TermsAndConditions() {
  const classes = useStyles();
  return (
    <div className={classes.root}>
      <NavBar />
      <div className={classes.box}>
        <Typography variant="h4" className={classes.title}>
          ContractFlo Terms of Use
        </Typography>
        <Typography variant="body2" className={classes.date}>
          Effective Date: May 03, 2022
        </Typography>
        <div className={classes.border} />
        <Typography variant="body2">
          Thank you for visiting this Site, which is owned and operated by
          ContractFlo, Inc. These Terms of Use govern your use of this Site.
          Capitalized terms are defined below.
        </Typography>

        <Typography variant="h5" className={classes.heading}>
          Your Acceptance of These Terms of Use
        </Typography>
        <Typography variant="body2">
          These Terms of Use apply to all users of this Site, whether or not you
          are a registered member. By using this Site you are agreeing to comply
          with and be bound by these Terms of Use. If you do not agree to these
          Terms of Use, you may not access or use this Site.
        </Typography>

        <Typography variant="h5" className={classes.heading}>
          Your Acceptance of Our Privacy Policy
        </Typography>
        <Typography variant="body2">
          By agreeing to these Terms of Use, you agree to the terms of our{" "}
          <Link className={classes.link} to="/privacy">
            Privacy Policy
          </Link>{" "}
          and to our{" "}
          <Link className={classes.link} to="/rules">
            Site/Forum
          </Link>{" "}
          Rules, which is expressly incorporated herein. Before using this Site,
          please carefully review our Privacy Policy. All personal information
          provided to us as a result of your use of this Site will be handled in
          accordance with our Privacy Policy. To the extent there are
          inconsistencies between these Terms of Use and our Privacy Policy,
          these Terms of Use control.
        </Typography>

        <Typography variant="h5" className={classes.heading}>
          Your Consent to Other Agreements
        </Typography>
        <Typography variant="body2">
          When you use a special feature of this Site, you may be asked to agree
          to special or additional terms governing your use of the special
          feature. In such cases, you may be asked to expressly consent to the
          special terms, for example, by checking a box or clicking on a button
          marked “I agree.” This type of agreement is known as a “click-through”
          agreement. If any of the terms of the click-through agreement are
          different than the terms of these Terms of Use, the terms of the
          click-through agreement will supplement or amend these Terms of Use,
          but only with respect to the matters governed by the “click-through
          agreement.”
        </Typography>

        <Typography variant="h5" className={classes.heading}>
          Ownership of this Site and its Content
        </Typography>
        <Typography variant="body2">
          <p className={classes.para}>
            This Site, including all its Content are protected under applicable
            intellectual property and other laws, including without limitation
            the laws of the United States and other countries. All Content and
            intellectual property rights therein are the property of ContractFlo
            or ContractFlo’s partners and is protected pursuant to applicable
            copyright and trademark laws.
          </p>
          <p className={classes.para}>
            The presence of any Content on this Site does not constitute a
            waiver of any right in such Content. You do not acquire ownership
            rights to any such Content viewed through this Site. Except as
            otherwise provided herein, none of this Content may be used, copied,
            reproduced, distributed, republished, downloaded, modified,
            displayed, posted or transmitted in any form or by any means,
            including, but not limited to, electronic, mechanical, photocopying,
            recording, or otherwise, without our express prior written
            permission.
          </p>
          <p className={classes.para}>
            Permission is hereby granted to the extent necessary to lawfully
            access and use this Site and to display, download, or print portions
            of this Site on a temporary basis and for your personal,
            educational, noncommercial use only, provided that you (i) do not
            modify the Content; (ii) you retain any and all copyright and other
            proprietary notices contained in the Content; and (iii) you do not
            copy or post the Content on any network computer or broadcast the
            Content in any media. All rights in and to the Site and Content not
            expressly granted are hereby reserved by ContractFlo.
          </p>
        </Typography>

        <Typography variant="h5" className={classes.heading}>
          Trademarks
        </Typography>
        <Typography variant="body2">
          The ContractFlo names and logos (including, without limitation, those
          of its affiliates), all product and service names, all graphics, all
          button icons, and all trademarks, service marks and logos appearing
          within this Site, unless otherwise noted, are trademarks (whether
          registered or not), service marks and/or trade dress of ContractFlo
          and/or its affiliates (the “ContractFlo Marks”). All other trademarks,
          product names, company names, logos, service marks and/or trade dress
          mentioned, displayed, cited or otherwise indicated within this Site
          are the property of their respective owners. You are not authorized to
          display or use the ContractFlo Marks in any manner without our prior
          written permission. You are not authorized to display or use
          trademarks, product names, company names, logos, service marks and/or
          trade dress of other owners featured within this Site without the
          prior written permission of such owners. The use or misuse of the
          ContractFlo Marks or other trademarks, product names, company names,
          logos, service marks and/or trade dress or any other materials
          contained herein, except as permitted herein, is expressly prohibited.
        </Typography>

        <Typography variant="h5" className={classes.heading}>
          Responsibility for User-Generated Content Posted on or Through this
          Site
        </Typography>
        <Typography variant="body2">
          <p className={classes.para}>
            You are responsible for User-Generated Content that you post. Under
            no circumstances will we be liable in any way for any UGC.
          </p>

          <p className={classes.para}>
            This means that you, not ContractFlo, are entirely responsible for
            all UGC that you post and that you can be held personally liable for
            comments that are defamatory, obscene, or libelous, or that violate
            these Terms of Use, an obligation of confidentiality, or the rights
            of others. If any part of the UGC you post is not your original
            work, it is your responsibility to obtain any necessary permission
            to post it.
          </p>

          <p className={classes.para}>
            Because we do not control the UGC posted on or through this Site, we
            cannot and do not warrant or guarantee the truthfulness, integrity,
            suitability, or quality of that UGC. You also agree and understand
            that by accessing this Site, you may encounter UGC that you may
            consider to be objectionable. We have no responsibility for any UGC,
            including without limitation any errors or omissions therein. We are
            not liable for any loss or damage of any kind you may claim was
            incurred as a result of the use of any UGC posted, emailed,
            transmitted or otherwise made available on or through this Site. The
            UGC posted on or through this Site expresses the personal opinions
            of the individuals who posted it and does not necessarily reflect
            the views of ContractFlo or any person or entity associated with
            ContractFlo.
          </p>
          <p className={classes.para}>
            You own Your User-Generated Content, but we may use it. You own the
            copyright in any original UGC you post. We do not claim any
            copyrights in UGC. However, by using this Site you are granting us
            and our subsidiaries, affiliates, successors and assigns, a
            nonexclusive, fully paid, worldwide, perpetual, irrevocable,
            royalty-free, transferable license (with the right to sublicense
            through unlimited levels of sublicensees) to use, copy, modify,
            distribute, publicly display and perform, publish, transmit, remove,
            retain repurpose, and commercialize UGC you post in any and all
            media or form of communication whether now existing or hereafter
            developed, without obtaining additional consent, without
            restriction, notification, or attribution, and without compensating
            you in any way, and to authorize others to do the same. For this
            reason, we ask that you not post any UGC that you do not wish to
            license to us, including any photographs, videos, confidential
            information, or product ideas.
          </p>

          <p className={classes.para}>
            ContractFlo and its Partners reserve the right to display
            advertisements in connection with your UGC and to use your UGC for
            advertising and promotional purposes.
          </p>

          <p className={classes.para}>
            We may disclose and/or remove User-Generated Content. ContractFlo
            has certain rights. We have the right (but do not assume the
            obligation) to:
          </p>
          <p className={classes.para}>
            <ul className={classes.unorderedList}>
              <li>monitor all UGC;</li>
              <li>require that you avoid certain subjects;</li>
              <li>
                remove or block any UGC at any time without notice at our sole
                and absolute discretion;
              </li>
              <li>
                disclose any UGC and the identity of the user who posted it in
                response to a subpoena or whenever we believe that disclosure is
                appropriate to comply with the law or a court order, to prevent
                or investigate a possible crime or other violation of law, to
                protect the rights of ContractFlo or others, or to enforce these
                Terms of Use; and
              </li>
              <li>
                terminate your access to and use of this Site, or to modify,
                edit or block your transmissions thereto, for any reason and in
                our sole discretion.
              </li>
            </ul>
          </p>
          <p className={classes.para}>
            You agree that our exercise of such discretion shall not render us
            the owners of UGC you post, and that you will retain ownership
            thereof as described above.
          </p>

          <p className={classes.para}>
            <em>Restrictions on User-Generated Content</em>. It is a condition
            of these Terms of Use that you do not:
          </p>

          <p className={classes.para}>
            <ul className={classes.unorderedList}>
              <li>
                <p>upload, post, transmit or otherwise make available</p>
                <ul className={classes.unorderedList}>
                  <li>
                    any UGC that is unlawful, harmful, hateful, threatening,
                    abusive, harassing, libelous, defamatory, obscene, vulgar,
                    pornographic, profane, racially disparaging, indecent, or
                    invasive of another’s privacy;
                  </li>
                  <li>
                    any UGC that constitutes or encourages activity illegal
                    under criminal or civil law;
                  </li>
                  <li>any UGC that is false, misleading, or fraudulent;</li>
                  <li>
                    any UGC that you do not have a right to make available under
                    any law or under contractual or fiduciary relationships
                    (such as inside information or proprietary and confidential
                    information learned or disclosed as part of employment
                    relationships or under nondisclosure agreements);
                  </li>

                  <li>
                    any UGC that violates or infringes upon the rights of
                    others, including UGC which violates the patent rights,
                    copyrights, trademark rights, privacy rights, publicity
                    rights, trade secret rights, confidentiality rights,
                    contract rights, or any other rights of any individual,
                    living or deceased, or any legal entity;
                  </li>
                  <li>
                    any UGC that contains the image, name or likeness of anyone
                    other than yourself, unless (i) that person is at least
                    eighteen years old and you have first obtained his/her
                    express permission or (ii) that person is under eighteen
                    years old but you are his/her parent or legal guardian;
                  </li>
                  <li>
                    any request for or solicitation of any personal or private
                    information from any individual to the extent such request
                    is not consistent with the networking goals of this Site;
                  </li>
                  <li>
                    any request for or solicitation of money, goods, or services
                    for private gain, except that such requests/solicitation are
                    permitted as mentioned on the page
                  </li>
                  <li>
                    any UGC that contains advertising, promotions or marketing,
                    or which otherwise has a commercial purpose, except for
                    those portions or features of the Site that expressly intend
                    to allow advertising, promoting, or marketing Your services,
                    products or business.;
                  </li>
                  <li>
                    any material that contains software viruses or any other
                    computer code, files or programs designed to interrupt,
                    destroy or limit the functionality of any computer software
                    or hardware or telecommunications equipment; or
                  </li>
                </ul>
              </li>
              <li>
                impersonate any person or entity or falsely state or otherwise
                misrepresent your affiliation with a person or entity; or
              </li>
              <li>
                violate any local, state, national or international law, rule or
                regulation.
              </li>
            </ul>
          </p>

          <p className={classes.para}>
            By posting User-Generated Content, you represent and warrant that
            (i) you own or otherwise control all of the rights to the UGC and
            have the right to grant the license set forth in these Terms of Use;
            (ii) the UGC is accurate, and (iii) you have read and understood—and
            your UGC fully complies with—these Terms of Use and applicable laws
            and will not cause injury to any person or entity.
          </p>
        </Typography>

        <Typography variant="h5" className={classes.heading}>
          Removal of Content
        </Typography>
        <Typography variant="body2">
          <p className={classes.para}>
            <em>In general</em>. You can seek removal of objectionable UGC, and
            lodge complaints against particular users, by contacting us at{" "}
            <Link className={classes.link} to="/terms">
              https://contractflo.com/contact-us
            </Link>
            . We will endeavor to review such requests and to remove UGC and
            users that we determine should be removed, in our sole discretion
            and in accordance with these Terms of Use and applicable law.
            However, by providing a mechanism for the submission of complaints,
            we make no promises that we will review all such complaints or that
            we will take any action in response to such complaints. Please be
            aware, however, that if the UGC has already been distributed to
            other websites or published in other media, we will not be able to
            recapture and delete it. Also, a back-up or residual copy of the UGC
            we remove from this Site may remain on back-up servers.
          </p>
          <p className={classes.para}>
            <em>Violation of copyrights</em>. ContractFlo does not knowingly
            violate or permit others to violate the copyrights of others. We
            will promptly remove or disable access to material that we know is
            infringing or if we become aware of circumstances from which
            infringing activity is apparent.
          </p>

          <p className={classes.para}>
            If you are requesting removal of content because of a violation of
            your copyrights, please note that the Digital Millennium Copyright
            Act of 1998 (the “DMCA”) provides recourse for copyright owners who
            believe that material appearing on the Internet infringes their
            rights under U.S. copyright law. If you believe that your own work,
            or the work of a third party for whom you are authorized to act, is
            featured on this Site or has been otherwise copied and made
            available on this Site in a manner that constitute copyright
            infringement, please notify us immediately. Your notice must be in
            writing and must include
          </p>
          <p className={classes.para}>
            <ul className={classes.unorderedList}>
              <li>
                an electronic or physical signature of the copyright owner or of
                the person authorized to act on behalf of the owner of the
                copyright interest;
              </li>
              <li>
                a description of the copyrighted work that you claim has been
                infringed;
              </li>
              <li>
                a description of where the material that you claim is infringing
                is located on this Site (including the URL, title and/or item
                number if applicable, or other identifying characteristics);
              </li>
              <li>
                your name, address, telephone number, and email address, and, if
                you are not the owner of the copyright, the name of the owner;
                and
              </li>
              <li>
                a written statement by you that you have a good-faith belief
                that the disputed use is not authorized by the copyright owner,
                its agent, or the law; and
              </li>
              <li>
                a statement by you, made under penalty of perjury, that the
                above information in your notice is accurate and that you are
                the copyright owner or authorized to act on the copyright
                owner's behalf.
              </li>
            </ul>
          </p>

          <p className={classes.para}>
            Your statement must be addressed as follows:
          </p>
          <p className={classes.para}>
            Copyright Agent <br /> ContractFlo, Inc. <br /> 3344 Walnut Street,{" "}
            <br /> Denver, CO 80205 <br /> copyright@contractflo.com
          </p>

          <p classname={classes.para}>
            Any notification by a copyright owner or a person authorized to act
            on its behalf that fails to comply with requirements of the DMCA
            shall not be considered sufficient notice and shall not be deemed to
            confer upon us actual knowledge of facts or circumstances from which
            infringing material or acts are evident.
          </p>
        </Typography>

        <Typography variant="h5" className={classes.heading}>
          Your Feedback
        </Typography>
        <Typography variant="body2">
          Although we do not claim ownership of User-Generated Content you post
          using this Site, the Feedback you provide to us through this Site will
          be and remain our exclusive property. Your submission of Feedback will
          constitute an assignment to us of all worldwide rights, title and
          interests in your Feedback, including all copyrights and other
          intellectual property rights in your Feedback. We will be entitled to
          reduce to practice, exploit, make, use, copy, disclose, display or
          perform publicly, distribute, improve and modify any Feedback you
          submit for any purpose whatsoever, without restriction and without
          compensating you in any way. For this reason, we ask that you not send
          us any Feedback that you do not wish to assign to us.
        </Typography>

        <Typography variant="h5" className={classes.heading}>
          Your Obligations
        </Typography>
        <Typography variant="body2">
          <p className={classes.para}>
            In consideration of your use of this Site, you agree that to the
            extent you provide personal information to ContractFlo it will be
            true, accurate, current, and complete and that you will update all
            personal information as necessary. You also agree that you will use
            an image of yourself that you are authorized to use for your profile
            picture. The use of company logos, advertisements, web addresses,
            contact information, pictures of celebrities or the unauthorized use
            of images owned by others is prohibited. Company logos may only be
            used on company profiles in our{" "}
            <Link className={classes.link} to="/real-estate-companies">
              Company Directory
            </Link>
            , and may only be posted by authorized representatives of the
            respective company.
          </p>
          <p className={classes.para}>
            To the extent you create an account through this Site, you
            understand and agree that any account you create, including your
            username and password, are personal to you and may not be used by
            anyone else. You are responsible for maintaining the confidentiality
            of your username and password and are fully responsible for all
            activities that occur under your username and password by you or by
            anyone else using your username and password, whether or not
            authorized by you. You agree to change your password immediately if
            you believe your password may have been compromised or used without
            authorization. You also agree to immediately inform us of any
            apparent breaches of security such as loss, theft or unauthorized
            disclosure or use of your username or password by contacting us
            using the information provided here:{" "}
            <Link classname={classes.link} to="/terms">
              https://contractflo.com/contact-us
            </Link>{" "}
            . Until we are so notified you will remain liable for any
            unauthorized use of your account.
          </p>

          <p className={classes.para}>
            You agree to use this Site in accordancewith any and all applicable
            rules and regulations. You agree not to upload or transmit through
            this Site any computer viruses, trojan horses, worms or anything
            else designed to interfere with, interrupt or disrupt the normal
            operating procedures of a computer. Any unauthorized modification,
            tampering or change of any information; any interference with the
            availability of or access to this Site; or any unauthorized scraping
            of the Content on this Site is strictly prohibited. We reserve all
            rights and remedies available to us, including but not limited to
            the right to terminate your access to this Site.
          </p>
        </Typography>

        <Typography variant="h5" className={classes.heading}>
          Calculators, Analysis Tools & Advice
        </Typography>
        <Typography variant="body2">
          <p className={classes.para}>
            The calculators, spreadsheets, & analysis tools found on this Site
            (“Tools”) are designed to be used for informational and educational
            purposes only and do not constitute investment or financial advice.
            ContractFlo recommends that you: (a) seek the advice of professional
            advisors, including real estate professionals, before making any
            type of investment or real estate decision (including, without
            limitation, the purchase of or investment in real estate), and (b)
            independently verify any calculation or output obtained from a Tool.
            Your use of Tools and Content found on the Site is at your own risk.
            The results from Tools and Content presented may not reflect the
            actual return of your own investments. ContractFlo is not
            responsible for the consequences of any decisions or actions taken
            in reliance upon or as a result of the information provided by these
            Tools. Furthermore, ContractFlo is not responsible for any human or
            mechanical errors or omissions.
          </p>
          <p className={classes.para}>
            Additionally, ContractFlo may offer opportunities to receive
            feedback or information directly or indirectly from ContractFlo's
            personnel (“Feedback”). The Feedback is informational in nature and
            are not legal, financial, real estate, or tax advice, and
            ContractFlo is not engaged in the provision of legal, tax or any
            other advice. You should seek your own advice from professional
            advisors, including lawyers and accountants, regarding the legal,
            tax, and financial implications of any real estate transaction you
            contemplate. ContractFlo does not make, and hereby disclaims, any
            representations and warranties regarding the content of the
            Feedback, whether express or implied, including implied warranties
            of merchantability or fitness for a particular purpose. You use the
            advice and information provided in the Feedback at your own risk.
            ContractFlo hereby disclaims any liability to you for any loss,
            damage, or cost arising from or related to the Feedback, including,
            without limitation, the accuracy, appropriateness, quality, or
            completeness of the information provided in the Feedback, regardless
            of the cause. ContractFlo is not liable or responsible to you with
            respect to any lost profits, loss or damage, including, without
            limitation, incidental, indirect, or consequential damages caused,
            or alleged to have been caused, directly or indirectly, by the
            Feedback.
          </p>
        </Typography>

        <Typography variant="h5" className={classes.heading}>
          Google Maps
        </Typography>
        <Typography variant="body2">
          The Site includes Google Maps features and content. Your use of any
          Google Maps features and content on the Site is subject to the
          ten-current versions of the: (1) Google Maps/Google Earth Additional
          Terms of Service at{" "}
          <Link className={classes.para} to="/terms">
            https://maps.google.com/help/terms_maps.html
          </Link>
          ; and (2) Google Privacy Policy at{" "}
          <Link className={classes.para} to="/terms">
            https://www.google.com/policies/privacy/
          </Link>
          .
        </Typography>

        <Typography variant="h5" className={classes.heading}>
          Fees and Payments
        </Typography>
        <Typography variant="body2">
          <p className={classes.para}>
            ContractFlo members can elect to upgrade their account to a level
            that requires payment (including, but not limited to a PREMIUM, PRO
            or Plus Account) or to purchase another subscription service offered
            by ContractFlo such as advertising in our Hard Money Lender
            Directory, where they are charged a subscription fee for the use of
            certain services. ContractFlo reserves the right to change the fees
            at any time, upon notice to you. By registering for a paid account
            level, or other subscription service, you agree to pay ContractFlo
            the fees for the services applicable to the account level chosen.
            For any upgrade or downgrade in plan level, the credit card that you
            provided will automatically be charged the new rate immediately.
          </p>

          <p className={classes.para}>
            All fees are paid in advance and are non-refundable. There will be
            no refunds or credits for partial months of service,
            upgrade/downgrade refunds, refunds for accounts that have had access
            to particular services restricted, refunds for accounts that have
            had upgrades canceled for any reason including violations of these
            Terms, or refunds for months unused. However, if a user upgrades and
            cancels within 24 hours without using the upgraded services offered
            to members with a paid subscription, we will offer a full refund
            minus any applicable cancellation fees. We reserve the right to
            deactivate your access to the services for your failure to pay
            applicable fees or for violations of these Terms. If you provide us
            with a credit card that expires during the term of these Terms of
            Service, we reserve the right to charge any renewal card issued to
            you as a replacement. You agree to promptly pay ContractFlo in the
            event of any refusal of your credit card issuer to pay any amount to
            ContractFlo for any reason. You agree to pay all costs of
            collection, including attorneys’ fees and costs, on any outstanding
            balance. In the event you fail to pay any amount when due,
            ContractFlo may immediately suspend or terminate your access to any
            or all of our services.
          </p>
          <p className={classes.para}>
            If purchasing a physical product outside of the United States,
            please be aware that you will pay an increase in International
            Shipping Fees at checkout and will likely pay duties upon delivery
            at your door. If you have any issues with these upon-delivery
            payments, you must contact the shipping carrier directly, as
            ContractFlo doesn't have any control over their processing and
            border-taxation.
          </p>
        </Typography>

        <Typography variant="h5" className={classes.heading}>
          Automatic Renewal
        </Typography>
        <Typography variant="body2">
          <p className={classes.para}>
            <strong>
              Your PREMIUM, PRO, Plus, or other paid account level or paid
              subscription will renew automatically, unless you cancel your
              subscription (see Cancellation on how to cancel). You must cancel
              your subscription before the calendar day it renews (the day of
              the month you are to be charged) to avoid billing of the
              subscription fees for the renewal term to your credit card.
              Additionally, we may terminate your subscription for a violation
              of these Terms.
            </strong>
          </p>
        </Typography>

        <Typography variant="h5" className={classes.heading}>
          Promotional or Trial Period Pricing
        </Typography>
        <Typography variant="body2">
          <p className={classes.para}>
            <strong>
              We may elect to offer free or discounted pricing for use of paid
              account levels or other subscription services (a "Trial"). If you
              do not cancel your subscription prior to the expiration of the
              Trial, then your credit card will be billed for the subscription
              fees. You agree to comply with any additional terms, restrictions
              or limitations we impose in connection with any Trial. You may not
              sign-up for multiple Accounts in order to receive additional
              benefits under any Trial.
            </strong>
          </p>
        </Typography>

        <Typography variant="h5" className={classes.heading}>
          Cancellation
        </Typography>
        <Typography variant="body2">
          <p className={classes.para}>
            You may cancel your subscription(s) at any time by logging into your
            ContractFlo account, going to your account preferences and clicking
            on the "Please cancel my ContractFlo account" link. Other
            subscriptions may be cancelled via the settings on the pages
            associated with their features. If you cancel the services before
            the last day of your current paid up month, your cancellation will
            take effect immediately and you will not be charged again.
          </p>
        </Typography>

        <Typography variant="h5" className={classes.heading}>
          Disclaimers
        </Typography>
        <Typography variant="body2">
          <p className={classes.para}>
            WE MAKE NO REPRESENTATIONS OR WARRANTIES WITH RESPECT TO THIS SITE
            OR ITS CONTENT, OR ANY TOOL, FEEDBACK, PRODUCT, OR SERVICE AVAILABLE
            ON OR PROMOTED THROUGH THIS SITE, INCLUDING PRODUCTS OR SERVICES
            FROM THIRD-PARTIES. THIS SITE, ALL TOOLS, ANY FEEDBACK, AND ALL OF
            ITS CONTENT (INCLUDING USER-GENERATED CONTENT) ARE PROVIDED ON AN
            “AS IS,” “AS AVAILABLE” BASIS, WITHOUT REPRESENTATIONS OR WARRANTIES
            OF ANY KIND. TO THE FULLEST EXTENT PERMITTED BY LAW, ContractFlo,
            ITS AFFILIATES, AND THEIR SERVICE PROVIDERS AND LICENSORS DISCLAIM
            ANY AND ALL REPRESENTATIONS AND WARRANTIES, WHETHER EXPRESS,
            IMPLIED, ARISING BY STATUTE, CUSTOM, COURSE OF DEALING, COURSE OF
            PERFORMANCE OR IN ANY OTHER WAY, WITH RESPECT TO THIS SITE, ITS
            CONTENT, TOOLS, ANY FEEDBACK, AND ANY PRODUCTS OR SERVICES AVAILABLE
            OR PROMOTED THROUGH THIS SITE. WITHOUT LIMITING THE GENERALITY OF
            THE FOREGOING, ContractFlo, ITS AFFILIATES, AND THEIR SERVICE
            PROVIDERS AND LICENSORS DISCLAIM ALL REPRESENTATIONS AND WARRANTIES
            (A) OF TITLE, NON-INFRINGEMENT, MERCHANTABILITY AND FITNESS FOR A
            PARTICULAR PURPOSE; (B) RELATING TO THE SECURITY OF THIS SITE; (C)
            THAT THE CONTENT OF THIS SITE, FEEDBACK, OR ANY TOOLS ARE ACCURATE,
            COMPLETE OR CURRENT; OR (D) THAT THIS SITE WILL OPERATE SECURELY OR
            WITHOUT INTERRUPTION OR ERROR. YOUR USE OF ALL TOOLS AND FEEDBACK IS
            AT YOUR OWN RISK.
          </p>
          <p className={classes.para}>
            WE DO NOT REPRESENT OR WARRANT THAT THIS SITE, ITS SERVERS, OR ANY
            TRANSMISSIONS SENT FROM US OR THROUGH THIS SITE WILL BE FREE OF ANY
            HARMFUL COMPONENTS (INCLUDING VIRUSES).
          </p>
          <p className={classes.para}>
            CONTRACTFLO DOES NOT ENDORSE AND IS NOT RESPONSIBLE FOR STATEMENTS,
            ADVICE AND OPINIONS MADE BY ANYONE OTHER THAN AUTHORIZED CONTRACTFLO
            SPOKESPERSONS. WE DO NOT ENDORSE AND ARE NOT RESPONSIBLE FOR ANY
            STATEMENTS, ADVICE OR OPINIONS CONTAINED IN USER-GENERATED CONTENT
            AND SUCH STATEMENTS, ADVICE AND OPINIONS DO NOT IN ANY WAY REFLECT
            THE STATEMENTS, ADVICE AND OPINIONS OF CONTRACTFLO. WE DO NOT MAKE
            ANY REPRESENTATIONS OR WARRANTIES AGAINST THE POSSIBILITY OF
            DELETION, MISDELIVERY OR FAILURE TO STORE COMMUNICATIONS,
            PERSONALIZED SETTINGS, OR OTHER DATA. YOU ACCEPT THAT OUR
            SHAREHOLDERS, OWNERS, OFFICERS, DIRECTORS, EMPLOYEES AND OTHER
            REPRESENTATIVES SHALL HAVE THE BENEFIT OF THIS CLAUSE. IN ADDITION,
            CONTRACTFLO MAKES NO REPRESENTATION, WARRANTY, OR GUARANTEE
            REGARDING THE RELIABILITY, TIMELINESS, QUALITY, SUITABILITY, OR
            AVAILABILITY OF ANY SERVICES OR GOODS OFFERED BY THIRD PARTIES.
          </p>
          <p className={classes.para}>
            APPLICABLE LAW MAY NOT ALLOW THE LIMITATION OF CERTAIN WARRANTIES,
            SO ALL OR PART OF THIS DISCLAIMER OF WARRANTIES MAY NOT APPLY TO
            YOU.
          </p>
        </Typography>

        <Typography variant="h5" className={classes.heading}>
          Limitation of liability
        </Typography>
        <Typography variant="body2">
          <p className={classes.para}>
            TO THE FULLEST EXTENT PERMITTED BY APPLICABLE LAWS WE, ON BEHALF OF
            OUR DIRECTORS, OFFICERS, EMPLOYEES, AGENTS, SUPPLIERS, LICENSORS AND
            SERVICE PROVIDERS, EXCLUDE AND DISCLAIM LIABILITY FOR ANY LOSSES AND
            EXPENSES OF WHATEVER NATURE AND HOWSOEVER ARISING INCLUDING, WITHOUT
            LIMITATION, ANY DIRECT, INDIRECT, GENERAL, SPECIAL, PUNITIVE,
            INCIDENTAL OR CONSEQUENTIAL DAMAGES; LOSS OF USE; LOSS OF DATA; LOSS
            CAUSED BY A VIRUS; LOSS OF INCOME OR PROFIT; LOSS OF OR DAMAGE TO
            PROPERTY; CLAIMS OF THIRD PARTIES; OR OTHER LOSSES OF ANY KIND OR
            CHARACTER, EVEN IF WE HAVE BEEN ADVISED OF THE POSSIBILITY OF SUCH
            DAMAGES OR LOSSES, ARISING OUT OF OR IN CONNECTION WITH THE USE OF
            THIS SITE. YOU ASSUME TOTAL RESPONSIBILITY FOR ESTABLISHING SUCH
            PROCEDURES FOR DATA BACK UP AND VIRUS CHECKING AS YOU CONSIDER
            NECESSARY. THIS LIMITATION OF LIABILITY APPLIES WHETHER THE ALLEGED
            LIABILITY IS BASED ON CONTRACT, TORT (INCLUDING NEGLIGENCE), STRICT
            LIABILITY OR ANY OTHER BASIS.
          </p>
          <p className={classes.para}>
            WE DO NOT REPRESENT OR WARRANT THAT THIS SITE, ITS SERVERS, OR ANY
            TRANSMISSIONS SENT FROM US OR THROUGH THIS SITE WILL BE FREE OF ANY
            HARMFUL COMPONENTS (INCLUDING VIRUSES).
          </p>
          <p className={classes.para}>
            This Site gives you specific legal rights and you may also have
            other rights which vary from country to country. Some jurisdictions
            do not allow certain kinds of limitations or exclusions of
            liability, so the limitations and exclusions set out in these Terms
            of Use may not apply to you. Other jurisdictions allow limitations
            and exclusions subject to certain conditions. In such a case the
            limitations and exclusions set out in these Terms of Use shall apply
            to the fullest extent permitted by the laws of such applicable
            jurisdictions. Your statutory rights as a consumer, if any, are not
            affected by these provisions, and we do not seek to exclude or limit
            liability for fraudulent misrepresentation.
          </p>
        </Typography>

        <Typography variant="h5" className={classes.heading}>
          Links to Third-Party Websites
        </Typography>
        <Typography variant="body2">
          <p className={classes.para}>
            This Site may: (a) provide links to other websites operated by third
            parties, or (b) allow you to interact with third party businesses.
            These third-parties may also be ContractFlo members Because we have
            no control over third-party websites or businesses, we are not
            responsible for the availability of those websites and do not
            endorse and are not responsible or liable for any services,
            products, content, advertising, services, products, or other
            materials on or available from such third parties, including their
            websites. ContractFlo does not endorse any third-party business or
            website, and in no event shall ContractFlo be responsible or liable
            for any products or services of such third parties. ContractFlo
            shall not be responsible or liable, directly or indirectly, for any
            damage or loss caused or alleged to be caused by or in connection
            with the use of or reliance on any content, advertising, services,
            products, or other materials on or available from such third parties
            or their websites. These Terms of Use do not apply to your use of
            third-party websites; your use of such websites is subject to the
            terms and policies of the owner of such websites.
          </p>
          <p className={classes.para}>
            ContractFlo has financial relationships with some of the companies,
            products, and services mentioned on our site, and may be compensated
            if users choose to follow the links pointing to those companies,
            products or services.
          </p>
        </Typography>

        <Typography variant="h5" className={classes.heading}>
          Communications; Text Messaging Services
        </Typography>
        <Typography variant="body2">
          <p className={classes.para}>
            We may offer communications via calls, SMS text messages or similar
            technology subject to our receipt of any consents from you required
            by applicable law. These communications may be sent or initiated by
            ContractFlo or any of its service providers, such as when we send
            agents notifications for lead requests submitted to ContractFlo
            through the Site. Message and data rates may apply. Message
            frequency may vary according to how you interact with our platform.
            <em>
              To stop receiving text messages from ContractFlo, reply STOP
            </em>
            . You agree we may send you a message to confirm your receipt of
            your STOP request. You can also opt-out of ContractFlo text messages
            by emailing us your request and mobile telephone number to
            support@contractflo.com.
          </p>
          <p className={classes.para}>
            You acknowledge and agree that our platform may not recognize and
            respond to texted unsubscribe requests that do not include the STOP
            keyword and agree that ContractFlo will have no liability for
            failing to honor such requests. You can also contact our customer
            assistance team by emailing us at support@contractflo.com. Not all
            mobile devices may be supported and text messaging may not be
            available in all areas. ContractFlo and the mobile carriers
            supported on our platform are not liable for delayed or undelivered
            text messages, text messages delivered to the wrong number, or
            inaccurate or incomplete content in a text message. We are not
            liable for your use or reliance on the content of any text message.
            You agree that all information you provide through the Site
            (including but not limited to your telephone number(s) and other
            contact information) will be accurate, current and truthful to the
            best of your knowledge. You consent to ContractFlo’s use of such
            information in accordance with our Privacy Policy at ContractFlo
            Privacy Policy. If you have any questions about your text plan or
            data plan, it is best to contact your wireless provider.
          </p>
        </Typography>

        <Typography variant="h5" className={classes.heading}>
          Modification, Discontinuation, and Termination
        </Typography>
        <Typography variant="body2">
          <p className={classes.para}>
            We reserve the right at any time and from time-to-time to modify,
            edit, delete, suspend or discontinue, temporarily or permanently
            this Site (or any portion thereof) and/or the information,
            materials, products and/or services available through this Site (or
            any part thereof) with or without notice. You agree that we shall
            not be liable to you or to any third party for any such
            modification, editing, deletion, suspension or discontinuance of
            this Site.
          </p>
          <p className={classes.para}>
            You also agree that ContractFlo, in its sole discretion, may
            terminate your password, account (or any part thereof), or use of
            this Site for any reason, including, without limitation, for lack of
            use or if ContractFlo believes that you have violated or acted
            inconsistently with the letter or spirit of these Terms of Use. You
            agree that any termination of your access to this Site under any
            provision of these Terms of Use may be effected without prior
            notice, and acknowledge and agree that ContractFlo may immediately
            deactivate or delete your account and all related information in
            your account and/or bar any further access to this Site. Further,
            you agree that ContractFlo shall not be liable to you or any
            third-party for any termination of your access to this Site.
          </p>
        </Typography>

        <Typography variant="h5" className={classes.heading}>
          Waiver
        </Typography>
        <Typography variant="body2">
          <p className={classes.para}>
            Our failure at any time to require performance of any provision of
            these Terms of Use or to exercise any right provided for herein will
            not be deemed a waiver of such provision or such right. All waivers
            must be in writing. Unless the written waiver contains an express
            statement to the contrary, no waiver by ContractFlo of any breach of
            any provision of these Terms of Use or of any right provided for
            herein will be construed as a waiver of any continuing or succeeding
            breach of such provision, a waiver of the provision itself, or a
            waiver of any right under these Terms of Use.
          </p>
        </Typography>

        <Typography variant="h5" className={classes.heading}>
          Severability
        </Typography>
        <Typography variant="body2">
          <p className={classes.para}>
            If any provision of these Terms of Use is held by a court of
            competent jurisdiction to be contrary to law, such provision will be
            changed and interpreted so as to best accomplish the objectives of
            the original provision to the fullest extent allowed by law and the
            remaining provisions of these Terms of Use will remain in full force
            and effect.
          </p>
        </Typography>

        <Typography variant="h5" className={classes.heading}>
          Governing Law, Jurisdiction and Venue
        </Typography>
        <Typography variant="body2">
          <p className={classes.para}>
            These Terms of Use will be governed under the laws of the State of
            Delaware without regard to its conflicts of law provisions. All
            actions or proceedings arising out of or relating to these Terms of
            Use will be venued exclusively in state or federal court in the City
            and Delaware county. You hereby irrevocably consent and
            submit to the personal jurisdiction of said courts for all such
            purposes. However, we retain the right to bring legal proceedings in
            any jurisdiction where we believe that infringement of these Terms
            of Use is taking place or originating.
          </p>
        </Typography>

        <Typography variant="h5" className={classes.heading}>
          Indemnity
        </Typography>
        <Typography variant="body2">
          <p className={classes.para}>
            respective officers, agents, partners and employees, harmless from
            any loss, liability, claim, or demand, including reasonable
            attorneys’ fees, made by any third party due to or arising out of
            your use of this Site in violation of these Terms of Use and/or
            arising from a breach of these Terms of Use and/or any breach of
            your representations and warranties set forth above and/or if any
            material that you post using this Site causes us to be liable to
            another. We reserve the right to defend any such claim, and you
            agree to provide us with such reasonable cooperation and information
            as we may request.
          </p>
        </Typography>

        <Typography variant="h5" className={classes.heading}>
          These Terms of Use May Change
        </Typography>
        <Typography variant="body2">
          <p className={classes.para}>
            These Terms of Use are current as of the effective date set forth
            above. reserves the right to change these Terms of Use from time to
            time consistent with applicable laws. These changes will be
            effective as of the date we post the revised version on this Site.
            Your continued use of this Site after we have posted the revised
            Terms of Use constitutes your agreement to be bound by the revised
            Terms of Use. If at any time you choose not to accept these Terms of
            Use, you should not use this Site.
          </p>
        </Typography>

        <Typography variant="h5" className={classes.heading}>
          Entire Agreement
        </Typography>
        <Typography variant="body2">
          <p className={classes.para}>
            These Terms of Use (together with our Privacy Policy and any Privacy
            Notices or click-through agreements applicable to you) contain the
            entire understanding and agreement between you and with respect to
            this Site and supersede all previous communications, negotiations,
            and agreements, whether oral, written, or electronic, between you
            and with respect to this Site and your use of this Site.
          </p>
        </Typography>

        <Typography variant="h5" className={classes.heading}>
          Indemnity
        </Typography>
        <Typography variant="body2">
          <p className={classes.para}>
            <em>The terms “ContractFlo,” “we,” “us,” and “our”</em> refer to
            ContractFlo, Inc.
          </p>
          <p className={classes.para}>
            <em>The term</em> “Content” refers to (a) all of the software and
            code comprising or used to operate this Site, and (b) all of the
            text, content, data, analysis, photographs, images, illustrations,
            graphics, sound recordings, video and audio-video clips, and other
            materials available on this Site, including User-Generated Content
            and Feedback.
          </p>
          <p className={classes.para}>
            <em>The term “Feedback”</em> refers to the Content you post on or
            through this Site that is specifically about how we can improve this
            Site and the products and services we make available through this
            Site.
          </p>
          <p className={classes.para}>
            <em>The term “including”</em> means “including, but not limited to.”
          </p>
          <p className={classes.para}>
            <em>The term “Site”</em> refers to the website located at
            www.contractflo.com and the features, services, programs, Tools, and
            content delivered or made available through or associated with the
            website.
          </p>
          <p className={classes.para}>
            <em>The terms “User-Generated Content” or “UGC”</em> refer to: (a)
            your publicly available profile information and (b) all content,
            materials, and information that you post, publish, or upload to the
            Site, including, without limitation, through any social networking
            tools available on the Site. UGC does not include “Feedback.”
          </p>
        </Typography>

        <Typography variant="h5" className={classes.heading}>
          Questions
        </Typography>
        <Typography variant="body2">
          <p className={classes.para}>
            If you have any questions about this Site or these Terms of Use,
            please contact us using the following information:
          </p>
          <p className={classes.para}>
            ContractFlo, Inc. <br />
            3344 Walnut St. <br />
            Denver, CO 80205 <br />
            877-831-4704 support@contactflo.com
          </p>
        </Typography>

        {/* <Typography variant="h5" className={classes.heading}>
          Indemnity
        </Typography>
        <Typography variant="body2">
          <p className={classes.para}></p>
        </Typography> */}
      </div>
    </div>
  );
}

export default TermsAndConditions;
