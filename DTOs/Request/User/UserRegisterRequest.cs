using System.ComponentModel.DataAnnotations;
using System.Security.Cryptography;

namespace Qinqii.DTOs.Request.User;

public class UserRegisterRequest
{
    
    [Required(ErrorMessage = "Password không được để trống")]
    [MaxLength(50, ErrorMessage = ("Độ dài password tối đa 50 ký tự :D"))]
    [MinLength(8, ErrorMessage = "Độ dài của password ít nhất phải là 8")]
    public string password { get; set; }
    [Required(ErrorMessage = "Email không được để trống")]


    [MaxLength(50, ErrorMessage = ("Độ dài email tối đa 50 ký tự :D"))]    


    public string email { get; set; }
    
    [MaxLength(15, ErrorMessage = ("Độ dài tên nhiều nhất là 15 :D"))]    
    [MinLength(3, ErrorMessage = "Độ dài của tên hiển thị ít nhất phải là 3")]
    [Required(ErrorMessage = "Tên hiển thị không được để trống")]
    public string name { get; set; }
        
}