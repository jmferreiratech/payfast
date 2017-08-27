import soap from "soap";

const POST_WS_URL = "http://ws.correios.com.br/calculador/CalcPrecoPrazo.asmx?wsdl";

class PostService {

    static deliveryDelay(deliveryData) {
        return soap.createClientAsync(POST_WS_URL)
            .then(client => client.CalcPrazoAsync(deliveryData));
    }
}

export default PostService;
