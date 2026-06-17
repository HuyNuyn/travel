const MESSAGES: Record<string, string> = {
  "Invalid login credentials": "Email hoặc mật khẩu không đúng.",
  "Email not confirmed":
    "Email chưa được xác nhận. Hãy kiểm tra hộp thư để xác nhận tài khoản.",
  "User already registered": "Email này đã được đăng ký. Hãy đăng nhập.",
  "Password should be at least 6 characters":
    "Mật khẩu cần tối thiểu 6 ký tự.",
  "Unable to validate email address: invalid format":
    "Định dạng email không hợp lệ.",
  "Signup requires a valid password": "Vui lòng nhập mật khẩu hợp lệ.",
};

export function translateAuthError(message: string) {
  return MESSAGES[message] ?? message;
}
