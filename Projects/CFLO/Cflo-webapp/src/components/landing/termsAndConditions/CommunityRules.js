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

function CommunityRules() {
  const classes = useStyles();
  return (
    <div className={classes.root}>
      <NavBar />
      <div className={classes.box}>
        <Typography variant="h4" className={classes.title}>
          ContractFlo Terms of Use
        </Typography>
        <Typography variant="h5" className={classes.heading}>
          Welcome to the ContractFlo Community Rules & Regulations
        </Typography>
        <Typography variant="body2">
          <p className={classes.para}>
            The{" "}
            <Link className={classes.link} to="/explore/forum">
              real estate investing discussion forums
            </Link>
            , marketplace, and social network at ContractFlo.com are where
            investors and other real estate professionals congregate. By
            participating in ContractFlo forums, marketplace, and social
            networks, you agree to follow the community rules and regulations
            outlined below. When we use the term “forum,” we mean any area of
            the ContractFlo.com that allows interaction with other individuals
            visiting or using ContractFlo.com, such as forums and marketplaces.
            You also agree to our{" "}
            <Link className={classes.link} to="/privacy">
              Privacy Policy
            </Link>{" "}
            and our{" "}
            <Link className={classes.link} to="/terms">
              Terms of Use
            </Link>
            .
          </p>
          <p className={classes.para}>
            Please take a moment to familiarize yourself with these rules and
            regulations. ContractFlo is a community, and we rely on you to keep
            this community friendly and enjoyable by following these rules.
          </p>
          <p className={classes.para}>
            If you feel that another member's post or activity has violated
            these rules and would like to bring it to our attention, you may
            contact us at contractflo.com/contact. Although ContractFlo tries to
            evaluate all reports regarding misuse of its services, it does not
            promise to do so, and it reserves the right to take any action or no
            action at all in response to such reports.
          </p>
        </Typography>

        <Typography variant="h5" className={classes.heading}>
          I. Forum And Blog Posting Regulations
        </Typography>
        <Typography variant="body2">
          <p className={classes.para}>
            A - No Pornographic or Sexual Material.
          </p>
          <p className={classes.para}>
            Sexually explicit discussions are not acceptable to our community.
            Sexually explicit content and links to such content are strictly
            prohibited.
          </p>
          <p className={classes.para}>B - No Profanity</p>
          <p className={classes.para}>
            The use of profanity is strictly prohibited, whether in titles,
            forums, blog posts, or anywhere else on ContractFlo.
          </p>
          <p className={classes.para}>
            C - No Contact Information is Allowed in the Forums
          </p>
          <p className={classes.para}>
            Contact Information is not allowed to be posted in the Forums. Users
            may not post email addresses, phone numbers, social media handles or
            links to their website or company website (unless member is posting
            in our Marketplace Forums--see Rule V below).
          </p>
          <p className={classes.para}>
            If you want to include your email address, website, or phone number
            for people to contact you, please put this information in your
            Signature. ContractFlo reserves the right to remove any email
            address, website or phone number that has been placed in our message
            posts as a means of contact, except in advertisement posts placed in
            our Marketplace.
          </p>
          <p className={classes.para}>
            In addition, do not disclose any personal information that you do
            not wish others to know.
          </p>
          <p className={classes.para}>
            D - No FAO (for the attention of) or Goodbye Posts.
          </p>
          <p className={classes.para}>
            Personal discussions or "for the attention of" posts are prohibited.
            Please use the private message feature, chat, or email for this
            purpose. In addition, please refrain from "Goodbye Forum" posts in
            forum threads.
          </p>
          <p className={classes.para}>E - No Impersonations.</p>
          <p className={classes.para}>
            Do not impersonate or attempt to impersonate other forum members,
            moderators, or administrators. In addition, do not post email
            addresses, standard addresses, ICQ and other messaging client
            numbers, or phone numbers which are not your own. The creation or
            use of fake user accounts is strictly prohibited.
          </p>
          <p className={classes.para}>
            F - You Must Disclose Your Relationship with any Company, Website,
            Guru, or Other Entity that You Comment About.
          </p>
          <p className={classes.para}>
            If you participate in a discussion about a company, website, guru,
            coaching program, etc., and have any kind of relationship with that
            entity (e.g. affiliate, partnership, employee, owner), you must
            disclose this relationship in your post. ContractFlo reserves the
            right to publicly or privately ask about your relationship with any
            company that you comment on, to remove any post which does not
            disclose such a relationship, and to close your account if you fail
            to disclose such a relationship.
          </p>
          <p className={classes.para}>G - One account per user, please.</p>
          <p className={classes.para}>
            ContractFlo users are limited to one account per person; users may
            not register or use alternate accounts.
          </p>
          <p className={classes.para}>H - No Abusive Behavior.</p>
          <p className={classes.para}>
            You agree, through your use of this service, that you will not post
            or otherwise transmit (including through the ContractFlo private
            messaging system) any material which is knowingly false and/or
            defamatory, abusive, hateful, harassing, obscene, sexually explicit,
            threatening, invasive of a person's privacy, or otherwise in
            violation of any law. ABUSIVE BEHAVIOR INCLUDES POSTING IN ALL CAPS!
            It is bad netiquette, and is flat out rude.
          </p>
          <p className={classes.para}>I - Do Not Flame or Troll</p>
          <p className={classes.para}>
            Flaming, flame-baiting, and trolling are not allowed anywhere on
            this site, including in posts, signatures, and private messages.
            Flaming is directly insulting another member, flame-baiting is
            making a comment with the intention of getting a flame as a
            response, and trolling involves starting arguments or upsetting
            people by posting inflammatory, extraneous, or off-topic messages
            with the intent of provoking readers into an emotional response or
            of otherwise disrupting normal on-topic discussion.
          </p>
          <p className={classes.para}>J - Remember - All Members are Equals</p>
          <p className={classes.para}>
            Treat all ContractFlo members equally, whether they are an admin, a
            moderator, or an average member. Do not single a member out because
            they have a low post count or a low status on the site. In addition,
            do not personally attack members who violate these rules. Instead,
            report the member or post to a moderator or admin.
          </p>
          <p className={classes.para}>K - Respect the Staff</p>
          <p className={classes.para}>
            If a staff member tells you to stop doing something, stop. Never
            attack the staff directly. If you disagree with any action taken by
            a staff member, please contact the administrator privately.
          </p>
          <p className={classes.para}>L - No Email Harvesting</p>
          <p className={classes.para}>
            Harvesting email addresses from our site is strictly prohibited. Do
            not harvest email addresses from ContractFlo users.
          </p>
          <p className={classes.para}>M - No Private Message SPAM</p>
          <p className={classes.para}>
            Users with basic ContractFlo memberships may only send private
            messages to their colleagues. ContractFlo PRO members may send
            private messages to any member, but these private messages may not
            contain advertisements or solicitations (this includes sending links
            directing people to your website) including copy and paste messages.
          </p>
          <p className={classes.para}>N - No Poaching or Polling</p>
          <p className={classes.para}>
            Diverting our members to competitor forums or websites is strictly
            forbidden.
          </p>
          <p className={classes.para}>
            Polling our members to gather information to be used on a competing
            real estate site, course, podcast, book, blog post or video is
            strictly forbidden.
          </p>
          <p className={classes.para}>O - No Affiliate Marketing</p>
          <p className={classes.para}>
            No form of affiliate marketing is allowed on ContractFlo. That means
            no posting affiliate links in messages, in your signature, in blog
            posts, or on your profile. Hiding affiliate links through services
            that provide short urls is also forbidden.
          </p>
          <p className={classes.para}>P - Posting Images in Threads.</p>
          <p className={classes.para}>
            Screenshots, photographs, and other images that you want to embed in
            your post must be no larger than 640 x 480 pixels. Larger images may
            be deleted, resized, or changed to a link.
          </p>
          <p className={classes.para}>Q - Stay On-Topic</p>
          <p className={classes.para}>
            Posts in a particular forum need to stay on-topic. If you want to
            talk about something that is drastically removed from the topic of a
            forum, please create a new topic. Posts that are unrelated to real
            estate must be placed in the off-topic forum.
          </p>
          <p className={classes.para}>R - No Religious or Political Postings</p>
          <p className={classes.para}>
            Religious statements and threads on the topic of religion are not
            permitted on ContractFlo. Please do not use a religious quote in
            your signature, or anywhere else on the site.
          </p>
          <p className={classes.para}>
            Political threads not permitted on ContractFlo. Any post or thread
            regarding politics will be removed. ContractFlo reserves the right
            to edit any post or thread that may contain political commentary.
          </p>
          <p className={classes.para}>
            ContractFlo is a real estate forum, not a forum for religious or
            political debates, discussions, or proselytizing.
          </p>
          <p className={classes.para}>S - No Thread Killing</p>
          <p className={classes.para}>
            Thread killing disrupts the flow of conversation on ContractFlo. If
            you are not happy with a post you made, you may remove it only
            before others have responded. Do not remove a post once others have
            responded to it.
          </p>
          <p className={classes.para}>T - NO SPAMMING</p>
          <p className={classes.para}>
            Spam is strictly prohibited on ContractFlo. Spamming is
            characterized by the initiation of threads or posts that contribute
            nothing to a forum, whether on or off-topic. Examples include:
            advertisements that are not located in the Marketplace Forums, empty
            posts, copy and pasting content from other websites, posts with few
            words that have no relation to the current thread, promotion of your
            website or product in any thread other than the classifieds, and
            those posts that state they are Spam, either to annoy or to increase
            a member's post count. Posting the same copy and paste message (or
            similar) across several threads is also considered Spam, as is
            filling your post with keywords with the goal of attracting
            searchers (keyword stuffing).
          </p>
          <p className={classes.para}>
            Responding to another user's advertisement with an advertisement for
            different products or services is strictly prohibited.
          </p>
          <p className={classes.para}>
            If you have information to share, post it in the forums. We have
            many read-only members who can also benefit from your information.
          </p>
          <p className={classes.para}>U - Off-Limits Ad & Solicitation Types</p>
          <p className={classes.para}>
            Posts or messages including chain letters, pyramid schemes, or any
            kind of Ponzi scheme are not allowed on our site. Promoting or
            marketing properties that you have no contractual or ownership
            interest in is also strictly prohibited.
          </p>
          <p className={classes.para}>
            V - No Advertising or Promotions Outside the BP Marketplace.
          </p>
          <p className={classes.para}>
            ContractFlo may consider looking for or offering deals, looking for
            or offering loans, looking for or offering to be a cash buyer,
            looking for or offering services or any mention of your company, or
            what your company does or links to your company website, social
            media handles or email address to be advertising.
          </p>
          <p className={classes.para}>W - Sponsored Posts are Prohibited</p>
          <p className={classes.para}>
            Your account is for your use only. You may not use your account to
            post on behalf of any other person or company. Posts may not be
            'sponsored by' or 'brought to you on behalf of' or any other
            variation on this theme in an effort to circumvent our 'No
            Self-Promotion' rules. This rule applies to all forums including
            Event announcements posted in the Events and Happenings Forum and
            the Marketplace Forum.
          </p>
          <p className={classes.para}>
            These rules apply to the Marketplace Threads: The primary purpose of
            ContractFlo is to give members a forum to discuss real estate.
            Advertising is a secondary benefit to paid members. We limit the
            number of ads each user may post. A user may start up to 2 new ad
            threads each day. A member may repeat an ad for a previously
            advertised product or service as long as at least 5 days have
            elapsed from the previous posting. Replying to an existing ad just
            to get it back to the top of the list is considered repeating an ad
            and can only be done after at least 5 days from a previous update.
            Replies that address questions or comments from other members are
            not subject to the 5 day time limit. Note that the limits on
            repeating ads are based on the product or service being advertised,
            not the specific text of the ad. Furthermore, ContractFlo reserves
            the right to remove ads or to close completely accounts of those
            users who have incomplete profiles, or who fail to provide enough
            information to identify the product or service that is being
            promoted, or for any other reason.
          </p>
        </Typography>

        <Typography variant="h5" className={classes.heading}>
          II - Member User Names, Signatures, Avatars, and Profile Information.
        </Typography>
        <Typography variant="body2">
          <p className={classes.para}>A - Profile Name</p>
          <p className={classes.para}>
            The name you enter for your first and last name MUST be your actual
            name -- pseudonyms or fake names are not allowed. Members may not
            use website URLs or email addresses as their profile link name, and
            profile names may not contain references to drugs, sex, or any other
            inappropriate material.
          </p>
          <p className={classes.para}>B - Avatars (Profile Images)</p>
          <p className={classes.para}>
            Member avatars exist so our users can share their personalities or
            photos. Avatars may not be used for promotional purposes. This means
            no ads and no company logos. In addition, users are strictly
            prohibited from using the following as an avatar: - Images depicting
            any person other than yourself - Images you are not authorized to
            use under copyright law - Sexually explicit images - Unprofessional
            images - Images that make a political or religious statement
          </p>
          <p className={classes.para}>C - Forum Signatures</p>
          <p className={classes.para}>
            PRO members are allowed to append signatures to their forum posts.
            These signatures will appear once a user upgrades to PRO and:
          </p>
          <p className={classes.para}>
            - Must be set up in your profile, and not manually added to your
            messages
            <br />
            - May not contain any pricing, sales, or product details
            <br />
            - May include two clickable link URLs and/or email
            <br />
            - May not contain links to other real estate forums or competing
            websites
            <br />
            - May not be rented or sold to anyone.
            <br />
            - May not consist exclusively of capital letters
            <br />
            - May not include links to YouTube channels, Facebook groups, or
            Meetup or LinkedIn pages
            <br />- Company logos may not be stock photography, any copyrighted
            image, book covers or contain contact information
          </p>
          <p className={classes.para}>
            Signatures that are offensive, insulting, or harmful to either
            ContractFlo, its members, or its staff, are strictly prohibited.
          </p>
          <p className={classes.para}>
            ContractFlo may remove any signature at any time for any reason.
          </p>
        </Typography>

        <Typography variant="h5" className={classes.heading}>
          III - LINK MODIFICATION BY ADMINISTRATORS
        </Typography>
        <Typography variant="body2">
          <p className={classes.para}>
            ContractFlo administrators may, at their discretion, modify any link
            contained within our forums. These modified links may contain codes
            allowing ContractFlo to profit for referred traffic.
          </p>
        </Typography>

        <Typography variant="h5" className={classes.heading}>
          IV - FORUM VOTING
        </Typography>
        <Typography variant="body2">
          <p className={classes.para}>
            ContractFlo' forum voting system was created so members can
            recognize others who have made valuable contributions to the
            community. ContractFlo employs automated voting bans and reserves
            the right to take any measure it deems necessary to prevent members
            from artificially inflating their influence or that of other
            members.
          </p>
        </Typography>

        <Typography variant="h5" className={classes.heading}>
          V - USE OF FORUM EMAIL & PRIVATE MESSAGING
        </Typography>
        <Typography variant="body2">
          <p className={classes.para}>
            Forum administrators reserve the right to periodically scan and
            review the forum email and private messages database in search of
            abuse.
          </p>
          <p className={classes.para}>
            Abuse of the forum email or private messaging systems may result in
            immediate removal from ContractFlo, and ContractFlo has the right
            (but not the obligation) to pursue all available remedies to address
            such abuse.
          </p>
        </Typography>

        <Typography variant="h5" className={classes.heading}>
          VI - OFFICIAL FORUM EMAIL & PRIVATE MESSAGES
        </Typography>
        <Typography variant="body2">
          <p className={classes.para}>
            Please note that by registering for this forum, you agree to receive
            emails and private messages about your account from forum
            administrators and moderators. You may also receive promotional
            messages from ContractFlo. See our Privacy Policy for how to opt out
            of promotional email.
          </p>
        </Typography>

        <Typography variant="h5" className={classes.heading}>
          VII - REMOVAL OF CONTENT, BANNING, SUSPENSION, TERMINATION
        </Typography>
        <Typography variant="body2">
          <p className={classes.para}>
            ContractFlo may in its sole discretion remove any content for any
            reason or no reason at all. In addition, ContractFlo may restrict,
            suspend, or terminate your access to parts of or to the entire
            ContractFlo Website if you violate any of the community rules and
            regulations or terms of use, or for any other reason, in its sole
            discretion. ContractFlo may take these actions at any time, with or
            without notice and without liability to any users.
          </p>
          <p className={classes.para}>
            ContractFlo' failure at any time to require performance of any
            provision of these rules and regulations or our Terms of Use or to
            exercise any right provided for herein will not be deemed a waiver
            of such right provision or such right. All waivers must be in
            writing. Unless the written waiver contains an express statement to
            the contrary, no waiver by ContractFlo of any breach of any
            provision of these rules and regulations or our Terms of Use or of
            any right provided for therein will be construed as a waiver of any
            continuing or succeeding breach of such provision, a waiver of the
            provision itself, or a waiver of any right under these rules and
            regulations or our Terms of Use.
          </p>
          <p className={classes.para}>
            Our forums and blog discussions are semi-moderated, and moderators
            or administrators may close or delete a thread at any time and for
            any reason. Once a topic is closed, members are not allowed to start
            a new thread with the same topic. All questions or remarks regarding
            closed or deleted threads must be e-mailed privately to the Forum.
          </p>
          <p className={classes.para}>
            It is your responsibility to maintain a current, valid email address
            in your registration information so that our moderators can contact
            you in the event of a policy violation, though no such contact by
            ContractFlo is required.
          </p>
          <p className={classes.para}>
            what, if anything, you can do to restore them, please email the
            forum administrator.
          </p>
          <p className={classes.para}>
            ContractFlo is a dynamic online community, and ContractFlo reserves
            the right to change or alter these rules at any time.
          </p>
          <p className={classes.para}>Last Updated: 3/05/2022</p>
        </Typography>
      </div>
    </div>
  );
}

export default CommunityRules;
