using Microsoft.AspNetCore.Mvc.ModelBinding;

namespace Qinqii.ModelBinders;

public class UserIdModelBinder : IModelBinder
{
    public IModelBinder _defaultBinder { get; }

    public UserIdModelBinder(IModelBinder? defaultBinder)
    {
        _defaultBinder = defaultBinder ??
                         throw new ArgumentNullException(nameof(defaultBinder));
    }

    public async Task BindModelAsync(ModelBindingContext bindingContext)
    {
        if(bindingContext == null) throw new ArgumentNullException(nameof(bindingContext));
        await _defaultBinder.BindModelAsync(bindingContext); // bind normally first to get the model set by default binder

        if (bindingContext.Result.IsModelSet) // if the model is set by default binder, set user_id
        {
            var userIdProperty = bindingContext.ModelType.GetProperty("user_id");
            if (userIdProperty != null)
            {
                userIdProperty.SetValue(bindingContext.Result.Model, 
                bindingContext
                    .HttpContext.GetUserId());
                bindingContext.Result = ModelBindingResult.Success(bindingContext.Result.Model);
            }    
        }
    }
}