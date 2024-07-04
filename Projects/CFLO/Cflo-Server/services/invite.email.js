const email = (text = "", link = "", linkText = "") => {
    var htmlText = `<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
    <html xmlns="http://www.w3.org/1999/xhtml" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office">
    <head>
        <!--[if gte mso 9]>
        <xml>
            <o:OfficeDocumentSettings>
            <o:AllowPNG/>
            <o:PixelsPerInch>96</o:PixelsPerInch>
            </o:OfficeDocumentSettings>
        </xml>
        <![endif]-->
        <meta http-equiv="Content-type" content="text/html; charset=utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
        <meta http-equiv="X-UA-Compatible" content="IE=edge" />
        <meta name="format-detection" content="date=no" />
        <meta name="format-detection" content="address=no" />
        <meta name="format-detection" content="telephone=no" />
        <link href="https://fonts.googleapis.com/css?family=Merriweather:400,400i,700,700i|Muli:400,400i,700,700i" rel="stylesheet" />
    
        <title>Email Template</title>
        
    
        <style type="text/css" media="screen">
            [style*="Muli"] { font-family: 'Muli', Arial, sans-serif !important; }
            [style*="Merriweather"] { font-family: 'Merriweather', Georgia, serif !important; }
    
            /* Linked Styles */
            body { padding:0 !important; margin:0 !important; display:block !important; min-width:100% !important; width:100% !important; background:#f3f3f3; -webkit-text-size-adjust:none }
            a { color:#acacac; text-decoration:none }
            p { padding:0 !important; margin:0 !important } 
            img { -ms-interpolation-mode: bicubic; /* Allow smoother rendering of resized image in Internet Explorer */ }
            .text-top a { color: #000000; }
    
            /* Mobile styles */
            @media only screen and (max-device-width: 480px), only screen and (max-width: 480px) {
                .mobile-shell { width: 100% !important; min-width: 100% !important; }
                .center { margin: 0 auto !important; }
                .left { margin-right: auto !important; }
    
                .h6-right,
                .text-right,
                .text-date3-right { text-align: left !important; }
                .row30-2 { padding: 30px 15px 30px 15px !important; }
                .pl18 { padding-left: 0px !important; }
                .pr18 { padding-right: 0px !important; }
                .text-footer2,
                .text-footer-r,
                .h6-m-center { text-align: center !important; }
                
                .row5-30,
                .row4-30,
                .separator1 { padding: 0px 0px 0px 0px !important; }
                .separator2 { padding: 30px 0px 0px 0px !important; }
                .bottom-link { padding: 20px 0px 30px 0px !important; }
                .section,
                .bar { padding: 15px 15px 15px 15px !important; }
                .d30 { padding-top: 0px !important; }
                .pb30m { padding-bottom: 0px !important; }
                .pb60m { padding-bottom: 0px !important; }
                .item-img img { width: 90px !important; height: auto !important; }
                
                .row30 { padding: 20px 0px 20px 0px !important; }
                .row2-30 { padding: 20px 0px 20px 0px !important; }
                .header,
                .section30 { padding: 30px 15px 30px 15px !important; }
                .section5 { padding: 0px 0px 30px 0px !important; }
                .section3 { padding: 0px 15px 30px 15px !important; }
                .section6 { padding: 0px 0px 30px 0px !important; }
    
                .td { width: 100% !important; min-width: 100% !important; }
    
                .text-mc,
                .text-top,
                .h2-header,
                .text-top2,
                .text-link-r,
                .h2-m-center,
                .img-m-center,
                .img-m-center2,
                .text-right-mc,
                .text-date-m-center { text-align: center !important; }
    
                .m-auto { height: auto !important; }
                .auto { width: 120px !important; }
    
                .mobile-br-5 { height: 5px !important; }
                .mobile-br-10 { height: 10px !important; }
                .mobile-br-15 { height: 15px !important; }
                .mobile-br-25 { height: 25px !important; }
                .mobile-br-35 { height: 35px !important; }
            
                .m-td,
                .m-td-top,
                .m-td-top-dir,
                .hide-for-mobile { display: none !important; width: 0 !important; height: 0 !important; font-size: 0 !important; line-height: 0 !important; min-height: 0 !important; }
    
                .mobile-block { display: block !important; }
    
                .fluid-img img { width: 100% !important; max-width: 100% !important; height: auto !important; }
    
                .column,
                .column-top,
                .column-dir-top,
                .column-bottom,
                .column-dir { float: left !important; width: 100% !important; display: block !important; }
                .m-td { width: 15px !important; }
            }
        </style>
    </head>
    <body class="body" style="padding:0 !important; margin:0 !important; display:block !important; min-width:100% !important; width:100% !important; background:#f3f3f3; -webkit-text-size-adjust:none">
        <table width="100%" border="0" cellspacing="0" cellpadding="0" bgcolor="#f3f3f3">
            <tr>
                <td align="center" valign="top">
                    <table width="650" border="0" cellspacing="0" cellpadding="0" class="mobile-shell">
                        <tr>
                            <td class="td" style="width:650px; min-width:650px; font-size:0pt; line-height:0pt; padding:30px 0px 30px 0px; margin:0; font-weight:normal; Margin:0">
                                <!-- Header -->
                                <table width="100%" border="0" cellspacing="0" cellpadding="0">
                                    <tr>
                                        <td>
    
                                            <table width="100%" border="0" cellspacing="0" cellpadding="0" class="spacer" style="font-size:0pt; line-height:0pt; text-align:center; width:100%; min-width:100%"><tr><td height="15" class="spacer" style="font-size:0pt; line-height:0pt; text-align:center; width:100%; min-width:100%">&nbsp;</td></tr></table>
    
                                            <!-- END Top Bar -->
                                            <!-- Header -->
                                            <table width="100%" border="0" cellspacing="0" cellpadding="0" bgcolor="#ffffff">
                                                <tr>
                                                    <td>
                                                        <!-- Columns -->
                                                        <table width="100%" border="0" cellspacing="0" cellpadding="0">
                                                            <tr>
                                                                <th class="column-top" style="font-size:0pt; line-height:0pt; padding:0; margin:0; font-weight:normal; vertical-align:top; Margin:0">
                                                                    <table width="100%" border="0" cellspacing="0" cellpadding="0">
                                                                        <tr>
                                                                            <td class="content-spacing" width="30"></td>
                                                                            <td style="padding-top: 30px;">
                                                                                <div class="img" style="font-size:0pt; line-height:0pt; text-align:left">
                                                                                    <div class="img-m-center" style="font-size:0pt; line-height:0pt">
                                                                                        <a href="#" target="_blank">
                                                                                            <img src="https://i.ibb.co/qyZ05cx/logo.png" editable="true" border="0" width="80" height="80" alt="" />
                                                                                        </a>
                                                                                        <td style="color:#000000; font-family:Georgia, serif, 'Merriweather'; font-size:30px; line-height:38px; text-align:left; font-weight:bold; padding:20px 0px 20px 0px"><multiline>ContractFlo</multiline></td>
                                                                                    </div>
                                                                                </div>
    
                                                                            </td>
                                                                            
                                                                        </tr>
                                                                    </table>
                                                                </th>
    
    
                                                            </tr>
                                                        </table>
                                                        <!-- END Columns -->
                                
    
                                                        <!-- END content -->
                                                    </td>
                                                </tr>
                                            </table>
                                            <!-- END Header -->
                                        </td>
                                    </tr>
                                </table>
                                <!-- END Header -->
                                
                                <repeater>
    
                                    
                                    
                                    <!-- Section 3 -->
                                    <layout label='Section 3'>
                                        <table width="100%" border="0" cellspacing="0" cellpadding="0" bgcolor="#ffffff">
                                            <tr>
                                                <td class="section" style="padding:30px 0px 10px 0px">
                                                    <table width="100%" border="0" cellspacing="0" cellpadding="0">
                                                        <tr>
                                                            <td class="h2-center" style="color:#424242; font-family:Georgia, serif, 'Merriweather'; font-size:14px; line-height:34px; text-align:center;"><multiline>${text}</multiline><div style="font-size:0pt; line-height:0pt;" class="mobile-br-15"></div>
    </td>
                                                        </tr>
                                                        <tr>
                                                            <td class="pb20" style="padding-bottom:20px"></td>
                                                        </tr>
                                                    </table>
    
                                                    <!-- END Two Columns -->
                                                    <table width="100%" border="0" cellspacing="0" cellpadding="0">
                                                        <tr>
                                                            <td class="bottom-link" style="padding:20px 15px 0px 15px" align="center">
                                                                <table class="center" border="0" cellspacing="0" cellpadding="0">
                                                                    <tr>
                                                                        <td class="img" style="font-size:0pt; line-height:0pt; text-align:left" width="27"><img src="images/ico_plus.jpg" editable="true" border="0" width="10" height="10" alt="" /></td>
                                                                        <td class="text-link" style="color:#000000; font-family:Georgia, serif, 'Merriweather'; font-size:13px; line-height:24px; text-align:left; font-weight:bold"><multiline><a href=${link} target="_blank" class="link-black-u" style="color:#000001; text-decoration:underline"><span class="link-black-u" style="color:#000001; text-decoration:underline">${linkText}</span></a></multiline></td>
                                                                    </tr>
                                                                </table>
                                                            </td>
                                                        </tr>
                                                        <tr>
                                                            <td class="separator1" style="padding:30px 30px 0px 30px"><table width="100%" border="0" cellspacing="0" cellpadding="0" bgcolor="#e3e3e3" class="border" style="font-size:0pt; line-height:0pt; text-align:center; width:100%; min-width:100%"><tr><td bgcolor="#e3e3e3" height="1" class="border" style="font-size:0pt; line-height:0pt; text-align:center; width:100%; min-width:100%">&nbsp;</td></tr></table>
    </td>
                                                        </tr>
                                                    </table>
                                                </td>
                                            </tr>
                                        </table>
                                    </layout>
                                    <!-- END Section 3 -->
                                    
                                    <!-- Section 4 -->
    
                                    
                                </repeater>
                                <!-- END Section 5 -->
    
                                <!-- Footer -->
                                <table width="100%" border="0" cellspacing="0" cellpadding="0" bgcolor="#ffffff">
                                    <tr>
                                        <td class="section3" style="padding:0px 30px 30px 30px">
                                            <table width="100%" border="0" cellspacing="0" cellpadding="0">
                                                <tr>
                                                    <th class="column-top" style="font-size:0pt; line-height:0pt; padding:0; margin:0; font-weight:normal; vertical-align:top; Margin:0" width="172">
                                                        <table width="100%" border="0" cellspacing="0" cellpadding="0">
                                                            <tr>
                                                                <td class="img" style="font-size:0pt; line-height:0pt; text-align:left"><div class="img-m-center" style="font-size:0pt; line-height:0pt"><a href="#" target="_blank"><img src="https://i.ibb.co/qyZ05cx/logo.png" editable="true" border="0" width="35" height="35" alt="" /></a></div></td>
                                                            </tr>
                                                        </table>
                                                    </th>
                                                    <th class="column" style="font-size:0pt; line-height:0pt; padding:0; margin:0; font-weight:normal; Margin:0">
                                                        <table width="100%" border="0" cellspacing="0" cellpadding="0">
                                                            <tr>
                                                                <td align="right">
                                                                    <div style="font-size:0pt; line-height:0pt;" class="mobile-br-15"></div>
    
                                                                    <table class="center" border="0" cellspacing="0" cellpadding="0">
                                                                        <tr>
                                                                        <td class="img" style="font-size:0pt; line-height:0pt; text-align:left" width="32"><a href="https://www.facebook.com/contractFlo" target="_blank"><img src="https://i.ibb.co/jWPbh9C/ico-facebook.jpg" editable="true" border="0" width="16" height="14" alt="" /></a></td>
                                                                        <td class="img" style="font-size:0pt; line-height:0pt; text-align:left" width="32"><a href="https://twitter.com/ContractFloHQ" target="_blank"><img src="https://i.ibb.co/qR4KhHs/ico-twitter.jpg" editable="true" border="0" width="16" height="14" alt="" /></a></td>
                                                                        <td class="img" style="font-size:0pt; line-height:0pt; text-align:left" width="16"><a href="https://www.linkedin.com/company/contractflo/" target="_blank"><img src="https://i.ibb.co/fGy4cqx/linkedin.png" editable="true" border="0" width="16" height="14" alt="" /></a></td>
                                                                        </tr>
                                                                    </table>
                                                                </td>
                                                            </tr>
                                                        </table>
                                                    </th>
                                                </tr>
                                            </table>
                                        </td>
                                    </tr>
                                </table>
    
                                <!-- END Footer -->
                            </td>
                        </tr>
                    </table>
                </td>
            </tr>
        </table>
    </body>
    </html>
    `;

    var htmlText = `
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Invite</title>
        <style>
      * {
        margin: 0;
        padding: 0;
        box-sizing: border-box;
      }
      body {
        width: 80%;
        margin: 0 auto;
      }
      .header {
        background-color: #2e73f8;
        text-align: center;
        padding: 20px;
      }

      .heroText {
        /* text-align: center; */
        display: inline-block;
        color: white;
        font-size: 60px;
        margin-left: 30px;
        transform: translateY(-26px);
      }

      .heroImg {
        width: 125px;
      }

      section {
        padding-top: 40px;
      }

      .underline {
        text-decoration: underline;
      }

      .messageSection {
        text-align: center;
        /* background-color: #f3f7ff; */
        padding-bottom: 20px;
        border-right: 1px solid #2e73f8;
        border-left: 1px solid #2e73f8;
      }

      .messageImg {
        width: 80px;
      }

      .messageText {
        text-align: center;
      }

      .messageBtn {
        display: inline-block;
        margin-top: 20px;
        text-decoration: none;
        color: white !important;
        background-color: #2e73f8;
        padding: 10px 20px;
        border-radius: 20px;
      }

      .messageBtn:hover {
        transform: translateY(-2px);
        transition: all 0.3s;
      }

      footer {
        background-color: #2e73f8;
        padding: 10px;
      }

      .footerBox {
        width: 95%;
        margin: 0 auto;
      }

      .footerImg {
        width: 40px;
      }

      .iconBox {
        width: 100px;
        float: right;
        margin-top: 7px;
      }

      .icon {
        display: inline-block;
        background-color: white;
        width: 25px;
        height: 25px;
        margin-left: 5px;
        /* border-radius: 50%; */
      }
    </style>
      </head>
      <body>
        <header class="header">
          <img
            class="heroImg"
            src="https://i.ibb.co/nf1LxP5/Screenshot-from-2022-04-14-10-46-27-new.png"
          />
          <h1 class="heroText">ContractFlo</h1>
        </header>
        <section class="messageSection">
          <h3 class="messageText">
            ${text}
          </h3>
          <a class="messageBtn" href="${link}">${linkText}</a>
        </section>
        <footer>
          <div class="footerBox">
            <img
              class="footerImg"
              src="https://i.ibb.co/nf1LxP5/Screenshot-from-2022-04-14-10-46-27-new.png"
            />
            <div class="iconBox">
              <a href="https://www.facebook.com/contractFlo" target="_blank">
                <img
                  class="icon"
                  src="https://i.ibb.co/HVHf7f8/Screenshot-2022-04-14-Invite-2.png"
                  alt="Screenshot-2022-04-14-Invite-2"
                />
              </a>

              <a href="https://twitter.com/ContractFloHQ" target="_blank">
                <img
                  class="icon"
                  src="https://i.ibb.co/vHHFXdB/Screenshot-2022-04-14-Invite-1.png"
                  alt="Screenshot-2022-04-14-Invite-1"
                />
              </a>
              <a
                href="https://www.linkedin.com/company/contractflo/"
                target="_blank"
              >
                <img
                  class="icon"
                  src="https://i.ibb.co/6mPCRN6/Screenshot-2022-04-14-Invite.png"
                />
              </a>
            </div>
          </div>
        </footer>
      </body>
    </html>
    `;

    htmlText = `
    
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
  <head>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Modern HTML Email Template</title>
    <style type="text/css">
      body {
        margin: 0;
      }
      table {
        border-spacing: 0;
        border-collapse: collapse;
      }
      td {
        padding: 0;
      }
      img {
        border: 0;
      }

      tbody {
        width: 100%;
      }

      .wrapper {
        width: 100%;
        table-layout: fixed;
      }
      .main {
        width: 600px;
        max-width: 100%;
        border-spacing: 0;
      }
      .two-columns {
        background-color: #fff;
        text-align: center;
        background-color: #2e73f8;
      }
      .two-columns .column {
        display: inline-block;
        border-spacing: 0;
        text-align: center;
      }
      .two-columns .col1 {
        width: 100%;
        max-width: 198px;
      }

      .two-columns .clo2 {
        width: 100%;
        max-width: 398px;
      }

      .footer {
        text-align: right;
      }

      .footer .column {
        display: inline-block;
        border-spacing: 0;
        text-align: right;
        width: 100%;
      }

      .footer .col1 {
        max-width: 498px;
      }

      .footer .col2 {
        max-width: 98px;
      }

      .icon {
        width: 25px;
      }
    </style>
  </head>
  <body>
    <center class="wrapper">
      <table class="main" width="100%">
        <tr>
          <td style="padding: 10px 0px; background-color: #2e73f8">
            <table width="100%">
              <tr>
                <td class="two-columns">
                  <table class="column col1" style="text-align: center">
                    <tr style="width: 100%">
                      <td style="text-align: center; padding-bottom: 10px">
                        <img
                          width="150"
                          src="https://i.ibb.co/nf1LxP5/Screenshot-from-2022-04-14-10-46-27-new.png"
                        />
                      </td>
                    </tr>
                  </table>
                  <table class="column col2">
                    <tr>
                      <td>
                        <p
                          style="
                            font-size: 60px;
                            color: white;
                            font-weight: 600;
                            margin: 36px 0;
                          "
                        >
                          ContractFlo
                        </p>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
            </table>
          </td>
        </tr>
        <tr>
          <td
            style="text-align: center; padding: 20px; border: 1px solid #2e73f8"
          >
            <p style="margin-bottom: 25px; margin-top: 0">
              Som Ahirwar Invitres you to join epic Organization
            </p>
            <a
              class="messageBtn"
              href="#"
              style="
                text-decoration: none;
                color: white;
                border-radius: 20px;
                background-color: #2e73f8;
                padding: 10px;
              "
              >Accept Invitation</a
            >
          </td>
        </tr>
        <tr>
          <td class="footer" style="background-color: #2e73f8; padding: 3px 0">
            <table class="column col1" style="text-align: center">
              <tr style="width: 100%">
                <td style="padding-left: 10px">
                  <img
                    width="40"
                    src="https://i.ibb.co/nf1LxP5/Screenshot-from-2022-04-14-10-46-27-new.png"
                  />
                </td>
              </tr>
            </table>

            <table class="column col2">
              <tr>
                <td style="padding-right: 3px">
                  <a
                    href="https://www.facebook.com/contractFlo"
                    target="_blank"
                  >
                    <img
                      class="icon"
                      src="https://i.ibb.co/HVHf7f8/Screenshot-2022-04-14-Invite-2.png"
                      alt="Screenshot-2022-04-14-Invite-2"
                    />
                  </a>

                  <a href="https://twitter.com/ContractFloHQ" target="_blank">
                    <img
                      class="icon"
                      src="https://i.ibb.co/vHHFXdB/Screenshot-2022-04-14-Invite-1.png"
                      alt="Screenshot-2022-04-14-Invite-1"
                    />
                  </a>
                  <a
                    href="https://www.linkedin.com/company/contractflo/"
                    target="_blank"
                  >
                    <img
                      class="icon"
                      src="https://i.ibb.co/6mPCRN6/Screenshot-2022-04-14-Invite.png"
                    />
                  </a>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    </center>
  </body>
</html>

    `;

    htmlText = `
    <!-- <!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Invite</title>
    <style>
      * {
        margin: 0;
        padding: 0;
        box-sizing: border-box;
      }
      body {
        width: 80%;
        margin: 0 auto;
      }
      .header {
        background-color: #2e73f8;
        text-align: center;
        padding: 20px;
      }

      .heroText {
        /* text-align: center; */
        display: inline-block;
        color: white;
        font-size: 60px;
        margin-left: 30px;
        transform: translateY(-26px);
      }

      .heroImg {
        width: 125px;
      }

      section {
        padding-top: 40px;
      }

      .underline {
        text-decoration: underline;
      }

      .messageSection {
        text-align: center;
        /* background-color: #f3f7ff; */
        padding-bottom: 20px;
        border-right: 1px solid #2e73f8;
        border-left: 1px solid #2e73f8;
      }

      .messageImg {
        width: 80px;
      }

      .messageText {
        text-align: center;
      }

      .messageBtn {
        display: inline-block;
        margin-top: 20px;
        text-decoration: none;
        color: white;
        background-color: #2e73f8;
        padding: 10px 20px;
        border-radius: 20px;
      }

      .messageBtn:hover {
        transform: translateY(-2px);
        transition: all 0.3s;
      }

      footer {
        background-color: #2e73f8;
        padding: 10px;
        margin-bottom: 20px;
      }

      .footerBox {
        width: 95%;
        margin: 0 auto;
      }
      .footerBox::after {
        content: " ";
        display: table;
        clear: both;
      }

      .footerImg {
        width: 40px;
      }

      .iconBox {
        width: 100px;
        float: right;
        margin-top: 7px;
      }

      .icon {
        display: inline-block;
        background-color: white;
        width: 25px;
        height: 25px;
        margin-left: 5px;
        /* border-radius: 50%; */
      }
    </style>
  </head>
  <body>
    <header class="header">
      <img
        class="heroImg"
        src="https://i.ibb.co/nf1LxP5/Screenshot-from-2022-04-14-10-46-27-new.png"
      />
      <h1 class="heroText">ContractFlo</h1>
    </header>
    <section class="messageSection">
      <h3 class="messageText">
        <span class="underline"> Som Ahirwar</span> Invites you to join
        <span class="underline">epic organization</span>
      </h3>
      <a class="messageBtn" href="#">Accept Invitation</a>
    </section>
    <footer>
      <div class="footerBox">
        <img
          class="footerImg"
          src="https://i.ibb.co/nf1LxP5/Screenshot-from-2022-04-14-10-46-27-new.png"
        />
        <div class="iconBox">
          <a href="https://www.facebook.com/contractFlo" target="_blank">
            <img
              class="icon"
              src="https://i.ibb.co/HVHf7f8/Screenshot-2022-04-14-Invite-2.png"
              alt="Screenshot-2022-04-14-Invite-2"
            />
          </a>

          <a href="https://twitter.com/ContractFloHQ" target="_blank">
            <img
              class="icon"
              src="https://i.ibb.co/vHHFXdB/Screenshot-2022-04-14-Invite-1.png"
              alt="Screenshot-2022-04-14-Invite-1"
            />
          </a>
          <a
            href="https://www.linkedin.com/company/contractflo/"
            target="_blank"
          >
            <img
              class="icon"
              src="https://i.ibb.co/6mPCRN6/Screenshot-2022-04-14-Invite.png"
            />
          </a>
        </div>
      </div>
    </footer>
  </body>
</html> -->
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html
  xmlns="http://www.w3.org/1999/xhtml"
  xmlns:v="urn:schemas-microsoft-com:vml"
  xmlns:o="urn:schemas-microsoft-com:office:office"
>
  <head>
    <!--[if gte mso 9]>
      <xml>
        <o:OfficeDocumentSettings>
          <o:AllowPNG />
          <o:PixelsPerInch>96</o:PixelsPerInch>
        </o:OfficeDocumentSettings>
      </xml>
    <![endif]-->
    <meta http-equiv="Content-type" content="text/html; charset=utf-8" />
    <meta
      name="viewport"
      content="width=device-width, initial-scale=1, maximum-scale=1"
    />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="format-detection" content="date=no" />
    <meta name="format-detection" content="address=no" />
    <meta name="format-detection" content="telephone=no" />
    <link
      href="https://fonts.googleapis.com/css?family=Merriweather:400,400i,700,700i|Muli:400,400i,700,700i"
      rel="stylesheet"
    />

    <title>Email Template</title>

    <style type="text/css" media="screen">
      [style*="Muli"] {
        font-family: "Muli", Arial, sans-serif !important;
      }
      [style*="Merriweather"] {
        font-family: "Merriweather", Georgia, serif !important;
      }

      /* Linked Styles */
      body {
        padding: 0 !important;
        margin: 0 !important;
        display: block !important;
        min-width: 100% !important;
        width: 100% !important;
        background: #f3f3f3;
        -webkit-text-size-adjust: none;
      }
      a {
        color: #acacac;
        text-decoration: none;
      }
      p {
        padding: 0 !important;
        margin: 0 !important;
      }
      img {
        -ms-interpolation-mode: bicubic; /* Allow smoother rendering of resized image in Internet Explorer */
      }
      .text-top a {
        color: #000000;
      }

      /* Mobile styles */
      @media only screen and (max-device-width: 480px),
        only screen and (max-width: 480px) {
        .mobile-shell {
          width: 100% !important;
          min-width: 100% !important;
        }
        .center {
          margin: 0 auto !important;
        }
        .left {
          margin-right: auto !important;
        }

        .h6-right,
        .text-right,
        .text-date3-right {
          text-align: left !important;
        }
        .row30-2 {
          padding: 30px 15px 30px 15px !important;
        }
        .pl18 {
          padding-left: 0px !important;
        }
        .pr18 {
          padding-right: 0px !important;
        }
        .text-footer2,
        .text-footer-r,
        .h6-m-center {
          text-align: center !important;
        }

        .row5-30,
        .row4-30,
        .separator1 {
          padding: 0px 0px 0px 0px !important;
        }
        .separator2 {
          padding: 30px 0px 0px 0px !important;
        }
        .bottom-link {
          padding: 20px 0px 30px 0px !important;
        }
        .section,
        .bar {
          padding: 15px 15px 15px 15px !important;
        }
        .d30 {
          padding-top: 0px !important;
        }
        .pb30m {
          padding-bottom: 0px !important;
        }
        .pb60m {
          padding-bottom: 0px !important;
        }
        .item-img img {
          width: 90px !important;
          height: auto !important;
        }

        .row30 {
          padding: 20px 0px 20px 0px !important;
        }
        .row2-30 {
          padding: 20px 0px 20px 0px !important;
        }
        .header,
        .section30 {
          padding: 30px 15px 30px 15px !important;
        }
        .section5 {
          padding: 0px 0px 30px 0px !important;
        }
        .section3 {
          padding: 0px 15px 30px 15px !important;
        }
        .section6 {
          padding: 0px 0px 30px 0px !important;
        }

        .td {
          width: 100% !important;
          min-width: 100% !important;
        }

        .text-mc,
        .text-top,
        .h2-header,
        .text-top2,
        .text-link-r,
        .h2-m-center,
        .img-m-center,
        .img-m-center2,
        .text-right-mc,
        .text-date-m-center {
          text-align: center !important;
        }

        .m-auto {
          height: auto !important;
        }
        .auto {
          width: 120px !important;
        }

        .mobile-br-5 {
          height: 5px !important;
        }
        .mobile-br-10 {
          height: 10px !important;
        }
        .mobile-br-15 {
          height: 15px !important;
        }
        .mobile-br-25 {
          height: 25px !important;
        }
        .mobile-br-35 {
          height: 35px !important;
        }

        .m-td,
        .m-td-top,
        .m-td-top-dir,
        .hide-for-mobile {
          display: none !important;
          width: 0 !important;
          height: 0 !important;
          font-size: 0 !important;
          line-height: 0 !important;
          min-height: 0 !important;
        }

        .mobile-block {
          display: block !important;
        }

        .fluid-img img {
          width: 100% !important;
          max-width: 100% !important;
          height: auto !important;
        }

        .column,
        .column-top,
        .column-dir-top,
        .column-bottom,
        .column-dir {
          float: left !important;
          width: 100% !important;
          display: block !important;
        }
        .m-td {
          width: 15px !important;
        }
      }
    </style>
  </head>
  <body
    class="body"
    style="
      padding: 0 !important;
      margin: 0 !important;
      display: block !important;
      min-width: 100% !important;
      width: 100% !important;
      background: #f3f3f3;
      -webkit-text-size-adjust: none;
    "
  >
    <table
      width="100%"
      border="0"
      cellspacing="0"
      cellpadding="0"
      bgcolor="#f3f3f3"
    >
      <tr>
        <td align="center" valign="top">
          <table
            width="650"
            border="0"
            cellspacing="0"
            cellpadding="0"
            class="mobile-shell"
          >
            <tr>
              <td
                class="td"
                style="
                  width: 650px;
                  min-width: 650px;
                  font-size: 0pt;
                  line-height: 0pt;
                  padding: 30px 0px 30px 0px;
                  margin: 0;
                  font-weight: normal;
                  margin: 0;
                "
              >
                <!-- Header -->
                <table width="100%" border="0" cellspacing="0" cellpadding="0">
                  <tr>
                    <td>
                      <table
                        width="100%"
                        border="0"
                        cellspacing="0"
                        cellpadding="0"
                        class="spacer"
                        style="
                          font-size: 0pt;
                          line-height: 0pt;
                          text-align: center;
                          width: 100%;
                          min-width: 100%;
                        "
                      >
                        <tr>
                          <td
                            height="15"
                            class="spacer"
                            style="
                              font-size: 0pt;
                              line-height: 0pt;
                              text-align: center;
                              width: 100%;
                              min-width: 100%;
                            "
                          >
                            &nbsp;
                          </td>
                        </tr>
                      </table>

                      <!-- END Top Bar -->
                      <!-- Header -->
                      <table
                        width="100%"
                        border="0"
                        cellspacing="0"
                        cellpadding="0"
                        bgcolor="#ffffff"
                      >
                        <tr>
                          <td>
                            <!-- Columns -->
                            <table
                              width="100%"
                              border="0"
                              cellspacing="0"
                              cellpadding="0"
                            >
                              <tr>
                                <th
                                  class="column-top"
                                  style="
                                    font-size: 0pt;
                                    line-height: 0pt;
                                    padding: 0;
                                    margin: 0;
                                    font-weight: normal;
                                    vertical-align: top;
                                    margin: 0;
                                  "
                                >
                                  <table
                                    width="100%"
                                    border="0"
                                    cellspacing="0"
                                    cellpadding="0"
                                  >
                                    <tr>
                                      <td
                                        class="content-spacing"
                                        width="30"
                                      ></td>
                                      <td style="padding-top: 30px">
                                        <div
                                          class="img"
                                          style="
                                            font-size: 0pt;
                                            line-height: 0pt;
                                            text-align: left;
                                          "
                                        >
                                          <div
                                            class="img-m-center"
                                            style="
                                              font-size: 0pt;
                                              line-height: 0pt;
                                            "
                                          >
                                            <a href="#" target="_blank">
                                              <img
                                                src="https://i.ibb.co/qyZ05cx/logo.png"
                                                editable="true"
                                                border="0"
                                                width="80"
                                                height="80"
                                                alt=""
                                              />
                                            </a>
                                            <td
                                              style="
                                                color: #000000;
                                                font-family: Georgia, serif,
                                                  'Merriweather';
                                                font-size: 30px;
                                                line-height: 38px;
                                                text-align: left;
                                                font-weight: bold;
                                                padding: 20px 0px 20px 0px;
                                              "
                                            >
                                              <multiline>ContractFlo</multiline>
                                            </td>
                                          </div>
                                        </div>
                                      </td>
                                    </tr>
                                  </table>
                                </th>
                              </tr>
                            </table>
                            <!-- END Columns -->

                            <!-- END content -->
                          </td>
                        </tr>
                      </table>
                      <!-- END Header -->
                    </td>
                  </tr>
                </table>
                <!-- END Header -->

                <repeater>
                  <!-- Section 3 -->
                  <layout label="Section 3">
                    <table
                      width="100%"
                      border="0"
                      cellspacing="0"
                      cellpadding="0"
                      bgcolor="#ffffff"
                    >
                      <tr>
                        <td class="section" style="padding: 30px 0px 10px 0px">
                          <table
                            width="100%"
                            border="0"
                            cellspacing="0"
                            cellpadding="0"
                          >
                            <tr>
                              <td
                                class="h2-center"
                                style="
                                  color: #424242;
                                  font-family: Georgia, serif, 'Merriweather';
                                  font-size: 14px;
                                  line-height: 34px;
                                  text-align: center;
                                "
                              >
                                <multiline>${text}</multiline>
                                <div
                                  style="font-size: 0pt; line-height: 0pt"
                                  class="mobile-br-15"
                                ></div>
                              </td>
                            </tr>
                            <tr>
                              <td
                                class="pb20"
                                style="padding-bottom: 20px"
                              ></td>
                            </tr>
                          </table>

                          <!-- END Two Columns -->
                          <table
                            width="100%"
                            border="0"
                            cellspacing="0"
                            cellpadding="0"
                          >
                            <tr>
                              <td
                                class="bottom-link"
                                style="padding: 20px 15px 0px 15px"
                                align="center"
                              >
                                <table
                                  class="center"
                                  border="0"
                                  cellspacing="0"
                                  cellpadding="0"
                                >
                                  <tr>
                                    <td
                                      class="img"
                                      style="
                                        font-size: 0pt;
                                        line-height: 0pt;
                                        text-align: left;
                                      "
                                      width="27"
                                    >
                                      <img
                                        src="images/ico_plus.jpg"
                                        editable="true"
                                        border="0"
                                        width="10"
                                        height="10"
                                        alt=""
                                      />
                                    </td>
                                    <td
                                      class="text-link"
                                      style="
                                        color: #000000;
                                        font-family: Georgia, serif,
                                          'Merriweather';
                                        font-size: 13px;
                                        line-height: 24px;
                                        text-align: left;
                                        font-weight: bold;
                                      "
                                    >
                                      <multiline
                                        ><a
                                          href="${link}"
                                          target="_blank"
                                          class="link-black-u"
                                          style="
                                            color: white;
                                            text-decoration: none;
                                            padding: 10px 15px;
                                            border-radius: 20px;
                                            background-color: #00b17a;
                                          "
                                          >${linkText}</a
                                        ></multiline
                                      >
                                    </td>
                                  </tr>
                                </table>
                              </td>
                            </tr>
                            <tr>
                              <td
                                class="separator1"
                                style="padding: 30px 30px 0px 30px"
                              >
                                <table
                                  width="100%"
                                  border="0"
                                  cellspacing="0"
                                  cellpadding="0"
                                  bgcolor="#e3e3e3"
                                  class="border"
                                  style="
                                    font-size: 0pt;
                                    line-height: 0pt;
                                    text-align: center;
                                    width: 100%;
                                    min-width: 100%;
                                  "
                                >
                                  <tr>
                                    <td
                                      bgcolor="#e3e3e3"
                                      height="1"
                                      class="border"
                                      style="
                                        font-size: 0pt;
                                        line-height: 0pt;
                                        text-align: center;
                                        width: 100%;
                                        min-width: 100%;
                                      "
                                    >
                                      &nbsp;
                                    </td>
                                  </tr>
                                </table>
                              </td>
                            </tr>
                          </table>
                        </td>
                      </tr>
                    </table>
                  </layout>
                  <!-- END Section 3 -->

                  <!-- Section 4 -->
                </repeater>
                <!-- END Section 5 -->

                <!-- Footer -->
                <table
                  width="100%"
                  border="0"
                  cellspacing="0"
                  cellpadding="0"
                  bgcolor="#ffffff"
                >
                  <tr>
                    <td class="section3" style="padding: 0px 30px 30px 30px">
                      <table
                        width="100%"
                        border="0"
                        cellspacing="0"
                        cellpadding="0"
                      >
                        <tr>
                          <th
                            class="column-top"
                            style="
                              font-size: 0pt;
                              line-height: 0pt;
                              padding: 0;
                              margin: 0;
                              font-weight: normal;
                              vertical-align: top;
                              margin: 0;
                            "
                            width="172"
                          >
                            <table
                              width="100%"
                              border="0"
                              cellspacing="0"
                              cellpadding="0"
                            >
                              <tr>
                                <td
                                  class="img"
                                  style="
                                    font-size: 0pt;
                                    line-height: 0pt;
                                    text-align: left;
                                  "
                                >
                                  <div
                                    class="img-m-center"
                                    style="font-size: 0pt; line-height: 0pt"
                                  >
                                    <a href="#" target="_blank"
                                      ><img
                                        src="https://i.ibb.co/qyZ05cx/logo.png"
                                        editable="true"
                                        border="0"
                                        width="35"
                                        height="35"
                                        alt=""
                                    /></a>
                                  </div>
                                </td>
                              </tr>
                            </table>
                          </th>
                          <th
                            class="column"
                            style="
                              font-size: 0pt;
                              line-height: 0pt;
                              padding: 0;
                              margin: 0;
                              font-weight: normal;
                              margin: 0;
                            "
                          >
                            <table
                              width="100%"
                              border="0"
                              cellspacing="0"
                              cellpadding="0"
                            >
                              <tr>
                                <td align="right">
                                  <div
                                    style="font-size: 0pt; line-height: 0pt"
                                    class="mobile-br-15"
                                  ></div>

                                  <table
                                    class="center"
                                    border="0"
                                    cellspacing="0"
                                    cellpadding="0"
                                  >
                                    <tr>
                                      <td
                                        class="img"
                                        style="
                                          font-size: 0pt;
                                          line-height: 0pt;
                                          text-align: left;
                                        "
                                        width="32"
                                      >
                                        <a
                                          href="https://www.facebook.com/contractFlo"
                                          target="_blank"
                                          ><img
                                            src="https://i.ibb.co/jWPbh9C/ico-facebook.jpg"
                                            editable="true"
                                            border="0"
                                            width="16"
                                            height="14"
                                            alt=""
                                        /></a>
                                      </td>
                                      <td
                                        class="img"
                                        style="
                                          font-size: 0pt;
                                          line-height: 0pt;
                                          text-align: left;
                                        "
                                        width="32"
                                      >
                                        <a
                                          href="https://twitter.com/ContractFloHQ"
                                          target="_blank"
                                          ><img
                                            src="https://i.ibb.co/qR4KhHs/ico-twitter.jpg"
                                            editable="true"
                                            border="0"
                                            width="16"
                                            height="14"
                                            alt=""
                                        /></a>
                                      </td>
                                      <td
                                        class="img"
                                        style="
                                          font-size: 0pt;
                                          line-height: 0pt;
                                          text-align: left;
                                        "
                                        width="16"
                                      >
                                        <a
                                          href="https://www.linkedin.com/company/contractflo/"
                                          target="_blank"
                                          ><img
                                            src="https://i.ibb.co/fGy4cqx/linkedin.png"
                                            editable="true"
                                            border="0"
                                            width="16"
                                            height="14"
                                            alt=""
                                        /></a>
                                      </td>
                                    </tr>
                                  </table>
                                </td>
                              </tr>
                            </table>
                          </th>
                        </tr>
                      </table>
                    </td>
                  </tr>
                </table>

                <!-- END Footer -->
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>

    `;

    return htmlText;
};

module.exports = email;
