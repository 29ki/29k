import i18next, {LANGUAGE_TAG} from '../i18n';

const getHeaderProps = (lng: LANGUAGE_TAG) => {
  const t = i18next.getFixedT(lng, 'email');

  return {headerImageURL: t('header.header__image')};
};

const getFooterProps = (lng: LANGUAGE_TAG) => {
  const t = i18next.getFixedT(lng, 'email');

  return {
    homeImageURL: t('footer.home__image'),
    homeURL: t('footer.homeURL'),
    instagramURL: t('footer.instagramURL'),
    facebookURL: t('footer.facebookURL'),
    donateImageUri: t('footer.donate__image'),
    unsubscribeText: t('footer.unsubscribe.text'),
  };
};

export const htmlLight = (content: string) => {
  return `
<mjml>
  <mj-head>
    <mj-attributes>
      <mj-all font-family="Open Sans, sans-serif" font-size="16px" letter-spacing="0.1" line-height="23px" color="#0C0A0D" />
    </mj-attributes>
    <mj-style>
      a,a:visited { color: #7D7080; }
      h1, h2, h3 { line-height: 1.5em; }
    </mj-style>
  </mj-head>
  <mj-body>
    <mj-section padding-bottom="0">
      <mj-column>
        <mj-image width="100px" alt="29k Logo" src="https://storage.googleapis.com/k-org-879a8.appspot.com/images/29k-logo-black-transparent.png"></mj-image>
        ${content}
      </mj-column>
    </mj-section>
    <mj-section padding-top="0">
      <mj-column>
        <mj-social font-size="12px" mode="horizontal" text-padding="0 10px 0  0">
          <mj-social-element href="https://29k.org" src="https://storage.googleapis.com/k-org-879a8.appspot.com/images/29k-logo-black-transparent.png">
            29k.org
          </mj-social-element>
          <mj-social-element name="instagram" href="https://www.instagram.com/29k_org/" padding-left="30">
            Instagram
          </mj-social-element>
          <mj-social-element name="facebook-noshare" href="https://www.facebook.com/29.org">
            Facebook
          </mj-social-element>
        </mj-social>
      </mj-column>
    </mj-section>
  </mj-body>
</mjml>`;
};

export const html = (content: string, lng: LANGUAGE_TAG) => {
  const {headerImageURL} = getHeaderProps(lng);
  const {
    homeImageURL,
    homeURL,
    instagramURL,
    facebookURL,
    donateImageUri,
    unsubscribeText,
  } = getFooterProps(lng);

  return `
  <mjml>
  <mj-head>
    <mj-font href="Open Sans"></mj-font>
    
    <mj-style>
      .button a {
        color: #FFFDF5 !important; 
      }
      a { 
      	color: #312833;
      }
      a:visited { 
      	color: #312833 !important;
      }  
      h1 {
        font-size: 40px;
        line-height: 48px;
        margin: 0px;
      }
      strong {
        color: #E65D45;
      }
      em {
        font-weight: bold;
        font-style: normal;
      }
    </mj-style>
    </mj-head>
  <mj-body background-color="#FFFDF5" color="#312833">
    <mj-section>
      <mj-column>

        <mj-image width="88px" alt="29k Logo" align="left" padding-top="48px" padding-bottom="48px" src="${headerImageURL}"></mj-image>
        ${content}
        <mj-social padding-top="80px"  font-size="16px" color="#312833" mode="horizontal" align="left" text-padding="8px"> 
          <mj-social-element href="${homeURL}" src="${homeImageURL}">
          ${homeURL.replace('https://', '')}
          </mj-social-element>
          <mj-social-element src="https://res.cloudinary.com/twentyninek/image/upload/v1652432252/Email%20assets/instagram-with-background_bqrhxp.png" href="${instagramURL}">
            Instagram
          </mj-social-element>
          <mj-social-element src="https://res.cloudinary.com/twentyninek/image/upload/v1652432252/Email%20assets/facebook-with-background_p4pjhp.png" href="${facebookURL}">
            Facebook
          </mj-social-element>
        </mj-social>
        
        ${
          donateImageUri !== ''
            ? `<mj-image href="https://29k.org/donate" width="552px" alt="29k_donate_button" align="left" src="${donateImageUri}"></mj-image>`
            : ''
        }

        <mj-text color="#312833" font-size="16px"><a href="[unsubscribe]">${unsubscribeText}<a/></mj-text>
        
      </mj-column>
    </mj-section>
  </mj-body>
</mjml>
  `;
};

export const textWihtoutUnsubscribe = (content: string) => `
29k
${content}

https://29k.org
Instagram: https://www.instagram.com/29k_org/
Facebook: https://www.facebook.com/29.org
`;

export const text = (content: string, lng: LANGUAGE_TAG) => {
  const {homeURL, instagramURL, facebookURL, unsubscribeText} =
    getFooterProps(lng);
  return `
29k
${content}

${homeURL}
Instagram: ${instagramURL}
Facebook: ${facebookURL}

${unsubscribeText}: <% %>
`;
};
