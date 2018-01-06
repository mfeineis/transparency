port module Ports exposing (fromElm, toElm)

import Json.Encode exposing (Value)


port toElm : (Value -> msg) -> Sub msg


port fromElm : Value -> Cmd msg
