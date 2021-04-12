import Button from "antd/lib/button";
import serialize from "form-serialize";
import { t } from "onefx/lib/iso-i18n";
import { Helmet } from "onefx/lib/react-helmet";
import { Link } from "onefx/lib/react-router-dom";
import { styled } from "onefx/lib/styletron-react";
import React, { useState } from "react";
import { connect } from "react-redux";
import { colorHover } from "@/shared/common/color-hover";
import { Flex } from "@/shared/common/flex";
import { transition } from "@/shared/common/styles/style-animation";
import { colors } from "@/shared/common/styles/style-color";
import { fullOnPalm } from "@/shared/common/styles/style-media";
import { ContentPadding } from "@/shared/common/styles/style-padding";
import { InputLabel } from "@/shared/onefx-auth-provider/email-password-identity-provider/view/input-label";
import { TextInput } from "@/shared/onefx-auth-provider/email-password-identity-provider/view/text-input";
import { axiosInstance } from "./axios-instance";
import { EmailField } from "./email-field";
import { FieldMargin } from "./field-margin";
import { FormContainer } from "./form-container";
import { PasswordField } from "./password-field";
import { H1, TopMargin } from "./sign-in";

const LOGIN_FORM = "signup";

type Props = {
  next: string;
};

const SignUpInner = (props: Props): JSX.Element => {
  const [errorEmail, setErrorEmail] = useState("");
  const [errorPassword, setErrorPassword] = useState("");
  const [valueEmail, setValueEmail] = useState("");
  const [valueWorkspaceName, setValueWorkspaceName] = useState("");
  const [valuePassword, setValuePassword] = useState("");
  const [disableButton, setDisableButton] = useState(false);

  const onSubmit = async (
    e: React.MouseEvent<HTMLElement, MouseEvent>
  ): Promise<void> => {
    e.preventDefault();
    const el = window.document.getElementById(LOGIN_FORM) as HTMLFormElement;
    const {
      email = "",
      password = "",
      workspaceName = "",
      next = "",
    } = serialize(el, {
      hash: true,
    }) as {
      email: string;
      password: string;
      workspaceName: string;
      next: string;
    };
    setDisableButton(true);
    setValueEmail(email);
    setValuePassword(password);
    setValueWorkspaceName(workspaceName);
    try {
      const r = await axiosInstance.post("/api/sign-up/", {
        email,
        password,
        workspaceName,
        next,
      });
      if (r.data.ok && r.data.shouldRedirect) {
        window.location.href = r.data.next;
        return;
      }
      if (r.data.error) {
        const { error } = r.data;
        setValueEmail(email);
        setErrorEmail("");
        setErrorPassword("");
        setDisableButton(false);
        switch (error.code) {
          case "auth/email-already-in-use":
          case "auth/invalid-email": {
            setErrorEmail(error.message);
            break;
          }
          default:
          case "auth/weak-password": {
            setErrorPassword(error.message);
          }
        }
      }
    } catch (err) {
      window.console.error(`failed to post sign-up: ${err}`);
    }
  };

  return (
    <ContentPadding>
      <Flex center>
        <Form id={LOGIN_FORM} onSubmit={onSubmit}>
          <Helmet title={`Sign Up - ${t("topbar.brand")}`} />
          <Flex column>
            <TopMargin />
            <H1>{t("auth/create_account")}</H1>
            <EmailField defaultValue={valueEmail} error={errorEmail} />
            <input defaultValue={props.next} hidden name="next" />
            <PasswordField defaultValue={valuePassword} error={errorPassword} />
            <FieldMargin>
              <InputLabel htmlFor="workspace-name">
                {t("auth/workspace")}
              </InputLabel>
              <TextInput
                defaultValue={valueWorkspaceName}
                id="workspaceName"
                name="workspaceName"
              />
            </FieldMargin>
            <FieldMargin>
              <Button
                htmlType="submit"
                loading={disableButton}
                onClick={(e: React.MouseEvent<HTMLElement, MouseEvent>) =>
                  onSubmit(e)
                }
                size="large"
                style={{ width: "100%" }}
                type="primary"
              >
                {t("auth/button_submit")}
              </Button>
            </FieldMargin>
          </Flex>
          <FieldMargin>
            <div
              dangerouslySetInnerHTML={{
                __html: t("auth/consent", {
                  tosUrl: "/p/legal/terms-of-service",
                  policyUrl: "/p/legal/privacy-policy",
                }),
              }}
              style={{ fontSize: "10px" }}
            />
          </FieldMargin>

          <FieldMargin>
            <StyleLink to="/login/">
              {t("auth/sign_up.switch_to_sign_in")}
            </StyleLink>
          </FieldMargin>
        </Form>
      </Flex>
    </ContentPadding>
  );
};

export const StyleLink = styled(Link, {
  ...colorHover(colors.primary),
  textDecoration: "none",
  transition,
});

const Form = styled(FormContainer, {
  width: "320px",
  ...fullOnPalm,
});

export const SignUp = connect((state: { base: { next: string } }) => ({
  next: state.base.next,
}))(SignUpInner);
