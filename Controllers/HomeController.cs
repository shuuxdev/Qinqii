﻿
using Microsoft.AspNetCore.Mvc;
namespace Qinqii.Controllers;
public class HomeController : Controller
{
    
    public IActionResult Index()
    {
        //default page
        return View();
    }
    
}
