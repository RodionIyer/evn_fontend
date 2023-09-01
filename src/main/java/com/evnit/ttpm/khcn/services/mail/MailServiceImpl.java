package com.evnit.ttpm.khcn.services.mail;

import javax.mail.MessagingException;
import javax.mail.internet.InternetAddress;
import javax.mail.internet.MimeMessage;

import com.evnit.ttpm.khcn.models.service.Mail;
import com.evnit.ttpm.khcn.models.service.MailDB;
import com.evnit.ttpm.khcn.services.storage.EmailService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.BeanPropertyRowMapper;
import org.springframework.jdbc.core.namedparam.MapSqlParameterSource;
import org.springframework.jdbc.core.namedparam.NamedParameterJdbcTemplate;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;


@Service
public class MailServiceImpl implements MailService
{
	@Autowired
	private JavaMailSender javaMailSender;

	@Autowired
	NamedParameterJdbcTemplate jdbcTemplate;

	@Autowired
	EmailService emailService;


	
	@Override
	public void sendEmail(Mail mail) throws Exception
	{
		MimeMessage mimeMessage = javaMailSender.createMimeMessage();

			MimeMessageHelper mimeMessageHelper = new MimeMessageHelper(mimeMessage, true);
			mimeMessageHelper.setSubject(mail.getMailSubject());
			mimeMessageHelper.setFrom(new InternetAddress(mail.getMailFrom()));
			mimeMessageHelper.setTo(mail.getMailTo());
			mimeMessageHelper.setText(mail.getMailContent());
			javaMailSender.send(mimeMessageHelper.getMimeMessage());

	}

	public void GetSendMailDB(String token){
		List<MailDB> listMail =	jdbcTemplate.query("SELECT TOP 10 * FROM API_GUI_EMAIL WHERE DANG_XU_LY = 0 AND DA_GUI =0 ORDER BY NGAY_TAO DESC ", BeanPropertyRowMapper.newInstance(MailDB.class));
		if(listMail != null && listMail.size() >0) {
			List<String> listMaMail = listMail.stream().map(MailDB::getMA_EMAIL).collect(Collectors.toList());

			MapSqlParameterSource parameter = new MapSqlParameterSource();
			parameter.addValue("MA_EMAIL", listMaMail);
			jdbcTemplate.update("UPDATE API_GUI_EMAIL SET DANG_XU_LY =1 WHERE MA_EMAIL IN (:MA_EMAIL)", parameter);
			for(MailDB item : listMail){
				Mail mail = new Mail();
				mail.setMailFrom(item.getNGUOI_GUI());
				String[] to =item.getNHOM_NGUOI_NHAN().split(",");
				mail.setMailTo(to);
				mail.setMailSubject(item.getTIEU_DE());
				mail.setMailContent(item.getNOI_DUNG());
				try{
					List<String> list = Arrays.asList(to);
					emailService.sendMail(list,mail.getMailSubject(),mail.getMailContent(),token);
					//sendEmail(mail);
					MapSqlParameterSource parameter2 = new MapSqlParameterSource();
					parameter2.addValue("MA_EMAIL", item.getMA_EMAIL());
					jdbcTemplate.update("UPDATE API_GUI_EMAIL SET DA_GUI =1 WHERE MA_EMAIL IN (:MA_EMAIL)", parameter2);
				}catch (Exception ex){
					MapSqlParameterSource parameter2 = new MapSqlParameterSource();
					parameter2.addValue("MA_EMAIL", item.getMA_EMAIL());
					jdbcTemplate.update("UPDATE API_GUI_EMAIL SET DANG_XU_LY =0 WHERE MA_EMAIL IN (:MA_EMAIL)", parameter2);
				}
			}
		}

	}

}
