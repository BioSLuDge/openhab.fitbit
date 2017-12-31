function mySettings(props) {
  return (
    <Page>
      <Section
        title={<Text bold align="center">openHAB Account</Text>}>
        <Oauth
          settingsKey="oauth"
          title="openHAB Login"
          label="openHAB"
          status="Login"
          authorizeUrl="https://XXXXX.com/oauth2/authorize"
          requestTokenUrl="https://XXXXX.com/oauth2/token"
          clientId="XXXXX"
          clientSecret="XXXXX"
          scope="item"
        />
      </Section>
    </Page>
  );
}

registerSettingsPage(mySettings);
