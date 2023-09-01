package com.evnit.ttpm.khcn.services.storage;

import com.evnit.ttpm.khcn.payload.request.email.EmailHeaderRequest;
import com.evnit.ttpm.khcn.payload.request.email.EmailRequest;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import javax.mail.MessagingException;
import javax.mail.internet.AddressException;
import java.util.List;

@Service
public class EmailService {

    @Value("${mail.smtp.emailConfigurationId}")
    private Integer emailConfigurationId;

    @Value("${app.utils.url}")
    private String urlService;

    /**
     *
     * @param listTo
     * @param subject
     * @param content
     * @return True: gửi thành công; false: Gửi không thành công
     * @throws AddressException
     * @throws MessagingException
     */
    @Async
    public void sendMail(List<String> listTo, String subject, String content, String bearerToken)
            throws AddressException, MessagingException {
        String[] recipients = new String[]{"sypv.evnit@evn.com.vn"};
        // String[] recipients = listTo.toArray(new String[0]);

        content = content + "<br><br><br> Trân trọng!";

        EmailHeaderRequest headerRequest = new EmailHeaderRequest();
        headerRequest.setSubject(subject);
        headerRequest.setEmailConfigurationId(emailConfigurationId);

        EmailRequest emailRequest = new EmailRequest();
        emailRequest.setBody(content);
        emailRequest.setEmailHeader(headerRequest);
        emailRequest.setRecipients(recipients);
        if (urlService != null && !urlService.equals("")) {
            callSendEmail(emailRequest, bearerToken);
        }
    }

    public Object callSendEmail(Object dataPdfBase64, String bearerToken) {
        Object rsData = null;
        try {

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            headers.set("Authorization", bearerToken);
            headers.set("Authorization-type", "Header");
            headers.set("Org-code", "EVN");
            RestTemplate restTemplate = new RestTemplate();
            HttpEntity<Object> requestEntity = new HttpEntity<>(dataPdfBase64, headers);
            ResponseEntity<Object> result = restTemplate.postForEntity(urlService + "/email/send", requestEntity,
                    Object.class);
            rsData = result.getBody();
        } catch (Exception e) {
            //e.printStackTrace();
        }
        return rsData;
    }
}
