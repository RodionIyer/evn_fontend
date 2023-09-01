/*
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
package com.evnit.ttpm.khcn.util;


import java.security.SecureRandom;
import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.time.LocalDate;
import java.time.ZoneId;
import java.util.*;

public class Util {
	public static final String HMAC_SHA1_ALGORITHM = "HmacSHA1";
	public static final String HMAC_KEY = "FMIS";
	private static final int RANDOM_VERSION = 4;
	private static final char[] SOURCE_CHARACTERS = { 'À', 'Á', 'Â', 'Ã', 'È', 'É', 'Ê', 'Ì', 'Í', 'Ò', 'Ó', 'Ô', 'Õ',
			'Ù', 'Ú', 'Ý', 'à', 'á', 'â', 'ã', 'è', 'é', 'ê', 'ì', 'í', 'ò', 'ó', 'ô', 'õ', 'ù', 'ú', 'ý', 'Ă', 'ă',
			'Đ', 'đ', 'Ĩ', 'ĩ', 'Ũ', 'ũ', 'Ơ', 'ơ', 'Ư', 'ư', 'Ạ', 'ạ', 'Ả', 'ả', 'Ấ', 'ấ', 'Ầ', 'ầ', 'Ẩ', 'ẩ', 'Ẫ',
			'ẫ', 'Ậ', 'ậ', 'Ắ', 'ắ', 'Ằ', 'ằ', 'Ẳ', 'ẳ', 'Ẵ', 'ẵ', 'Ặ', 'ặ', 'Ẹ', 'ẹ', 'Ẻ', 'ẻ', 'Ẽ', 'ẽ', 'Ế', 'ế',
			'Ề', 'ề', 'Ể', 'ể', 'Ễ', 'ễ', 'Ệ', 'ệ', 'Ỉ', 'ỉ', 'Ị', 'ị', 'Ọ', 'ọ', 'Ỏ', 'ỏ', 'Ố', 'ố', 'Ồ', 'ồ', 'Ổ',
			'ổ', 'Ỗ', 'ỗ', 'Ộ', 'ộ', 'Ớ', 'ớ', 'Ờ', 'ờ', 'Ở', 'ở', 'Ỡ', 'ỡ', 'Ợ', 'ợ', 'Ụ', 'ụ', 'Ủ', 'ủ', 'Ứ', 'ứ',
			'Ừ', 'ừ', 'Ử', 'ử', 'Ữ', 'ữ', 'Ự', 'ự', };

	private static final char[] DESTINATION_CHARACTERS = { 'A', 'A', 'A', 'A', 'E', 'E', 'E', 'I', 'I', 'O', 'O', 'O',
			'O', 'U', 'U', 'Y', 'a', 'a', 'a', 'a', 'e', 'e', 'e', 'i', 'i', 'o', 'o', 'o', 'o', 'u', 'u', 'y', 'A',
			'a', 'D', 'd', 'I', 'i', 'U', 'u', 'O', 'o', 'U', 'u', 'A', 'a', 'A', 'a', 'A', 'a', 'A', 'a', 'A', 'a',
			'A', 'a', 'A', 'a', 'A', 'a', 'A', 'a', 'A', 'a', 'A', 'a', 'A', 'a', 'E', 'e', 'E', 'e', 'E', 'e', 'E',
			'e', 'E', 'e', 'E', 'e', 'E', 'e', 'E', 'e', 'I', 'i', 'I', 'i', 'O', 'o', 'O', 'o', 'O', 'o', 'O', 'o',
			'O', 'o', 'O', 'o', 'O', 'o', 'O', 'o', 'O', 'o', 'O', 'o', 'O', 'o', 'O', 'o', 'U', 'u', 'U', 'u', 'U',
			'u', 'U', 'u', 'U', 'u', 'U', 'u', 'U', 'u', };

	private Util() {
		throw new UnsupportedOperationException("Cannot instantiate a Util class");
	}

	public static String generateRandomUuid() {
		return UUID.randomUUID().toString();
	}

	public static String folderName(String module, String donviId, String username, String path) {
		// Upload file to Utils services
		DateFormat simpleDateFormat = new SimpleDateFormat("yyyyMMddHHmmss");
		Date date = new Date();
		String strDate = simpleDateFormat.format(date);
		String path1 = "/smartevn/" + module + "/" + donviId + "/" + username + "/" + strDate;
		String pathFull = path1;
		if (path != null) {
			pathFull = path1 + "/" + path;
		}
		return pathFull;
	}

	public static String folderDvName(String username, String donviId, String path) {
		// Upload file to Utils services
		DateFormat simpleDateFormat = new SimpleDateFormat("yyyyMMddHHmmss");
		Date date = new Date();
		String strDate = simpleDateFormat.format(date);
		String path1 = "/bckh/" + donviId + "/" + username.replace("\\","/") + "/" + strDate;
		String pathFull = path1;
		if (path != null) {
			pathFull = path1 + "/" + path;
		}
		return pathFull;
	}

	public static Long subTwoDate(Date date1, Date date2) {
		Long total = null;
		try {
			long getDiff = date2.getTime() - date1.getTime();
			total = getDiff / (24 * 60 * 60 * 1000);
		} catch (Exception e) {
			//e.printStackTrace();
		}
		return total;
	}

	public static Long subTwoDate2(Date date1, Date date2) {
		Long total = null;
		try {
			if (date1 != null && date2 != null) {
				long getDiff = date2.getTime() - date1.getTime();
				total = getDiff / (24 * 60 * 60 * 1000) + 1;
			}
		} catch (Exception e) {
			//e.printStackTrace();
		}
		return total;
	}

	public static char removeAccent(char ch) {
		int index = Arrays.binarySearch(SOURCE_CHARACTERS, ch);
		if (index >= 0) {
			ch = DESTINATION_CHARACTERS[index];
		}
		return ch;
	}

	public static String removeAccent(String str) {
		StringBuilder sb = new StringBuilder(str);
		for (int i = 0; i < sb.length(); i++) {
			sb.setCharAt(i, removeAccent(sb.charAt(i)));
		}
		return sb.toString();
	}

	public static LocalDate convertToLocalDateViaInstant(Date dateToConvert) {
		Calendar calendar = Calendar.getInstance();
		calendar.setTime(dateToConvert);
		Date date = calendar.getTime();
		return date.toInstant().atZone(ZoneId.systemDefault()).toLocalDate();
	}

	

	public static UUID getRandomUuid(Random random) {

		long msb = 0;
		long lsb = 0;

		// (3) set all bit randomly
		if (random instanceof SecureRandom) {
			// Faster for instances of SecureRandom
			final byte[] bytes = new byte[16];
			random.nextBytes(bytes);
			msb = toNumber(bytes, 0, 8); // first 8 bytes for MSB
			lsb = toNumber(bytes, 8, 16); // last 8 bytes for LSB
		} else {
			msb = random.nextLong(); // first 8 bytes for MSB
			lsb = random.nextLong(); // last 8 bytes for LSB
		}

		// Apply version and variant bits (required for RFC-4122 compliance)
		msb = (msb & 0xffffffffffff0fffL) | (RANDOM_VERSION & 0x0f) << 12; // apply version bits
		lsb = (lsb & 0x3fffffffffffffffL) | 0x8000000000000000L; // apply variant bits

		// Return the UUID
		return new UUID(msb, lsb);
	}

	private static long toNumber(final byte[] bytes, final int start, final int length) {
		long result = 0;
		for (int i = start; i < length; i++) {
			result = (result << 8) | (bytes[i] & 0xff);
		}
		return result;
	}


	public static boolean isNotEmpty(Object obj){
		if(obj !=null && !obj.equals("") && !obj.toString().equals("")){
			return true;
		}
		return false;
	}


}
