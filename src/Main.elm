module Main exposing (main)

import Html exposing (Html)
import Json.Decode as Decode exposing (Value)
import Ports


type alias Flags =
    {}


type alias Model =
    {}


type Msg
    = Incoming Value
    | Init


type alias MsgEnvelope =
    { meta : Value
    , payload : Value
    , type_ : String
    }


decodeEnvelope : Decode.Decoder MsgEnvelope
decodeEnvelope =
    Decode.map3 MsgEnvelope
        (Decode.field "meta" Decode.value)
        (Decode.field "payload" Decode.value)
        (Decode.field "type" Decode.string)


parseIncoming : Value -> Result String Msg
parseIncoming value =
    case Decode.decodeValue decodeEnvelope value of
        Ok { type_, payload } ->
            case type_ of
                "INIT" ->
                    Debug.log ("parseIncoming => '" ++ type_ ++ "'")
                        (Ok Init)

                _ ->
                    Err ("Unknown incoming message type '" ++ type_ ++ "'")

        Err error ->
            Err error


init : Flags -> ( Model, Cmd Msg )
init flags =
    ( {}, Cmd.none )


main : Program Never Model Msg
main =
    Html.program
        { init = init {}
        , subscriptions = subscriptions
        , update = update
        , view = view
        }


subscriptions : Model -> Sub Msg
subscriptions model =
    Sub.batch
        [ Ports.toElm Incoming
        ]


update : Msg -> Model -> ( Model, Cmd Msg )
update msg model =
    case msg of
        Incoming value ->
            case parseIncoming value of
                Ok incomingMsg ->
                    update incomingMsg model

                Err errorMessage ->
                    Debug.log ("[ERR] Incoming error: " ++ errorMessage)
                        ( model, Cmd.none )

        Init ->
            ( model, Cmd.none )


view : Model -> Html Msg
view model =
    Html.div []
        [ Html.node "style"
            []
            [ Html.text
                """

/* http://meyerweb.com/eric/tools/css/reset/
   v2.0 | 20110126
   License: none (public domain)
*/

html, body, div, span, applet, object, iframe,
h1, h2, h3, h4, h5, h6, p, blockquote, pre,
a, abbr, acronym, address, big, cite, code,
del, dfn, em, img, ins, kbd, q, s, samp,
small, strike, strong, sub, sup, tt, var,
b, u, i, center,
dl, dt, dd, ol, ul, li,
fieldset, form, label, legend,
table, caption, tbody, tfoot, thead, tr, th, td,
article, aside, canvas, details, embed,
figure, figcaption, footer, header, hgroup,
menu, nav, output, ruby, section, summary,
time, mark, audio, video {
    margin: 0;
    padding: 0;
    border: 0;
    font-size: 100%;
    font: inherit;
    vertical-align: baseline;
}
/* HTML5 display-role reset for older browsers */
article, aside, details, figcaption, figure,
footer, header, hgroup, menu, nav, section {
    display: block;
}
body {
    line-height: 1;
}
ol, ul {
    list-style: none;
}
blockquote, q {
    quotes: none;
}
blockquote:before, blockquote:after,
q:before, q:after {
    content: '';
    content: none;
}
table {
    border-collapse: collapse;
    border-spacing: 0;
}

/* Box-sizing is border-box */

html {
    box-sizing: border-box;
}
*, *:before, *:after {
    box-sizing: inherit;
}

                """
            ]
        , Html.text "Hello World!"
        ]
