using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Formatters;
using Microsoft.AspNetCore.Mvc.Infrastructure;
using Microsoft.AspNetCore.Mvc.ModelBinding;
using Microsoft.AspNetCore.Mvc.ModelBinding.Binders;
using Microsoft.Extensions.Options;

namespace Qinqii.ModelBinders;

public class UserIdModelBinderProvider : IModelBinderProvider
{

    private readonly IList<IInputFormatter> _formatters;
    private readonly IHttpRequestStreamReaderFactory _readerFactory;
    public UserIdModelBinderProvider(IList<IInputFormatter> formatters, IHttpRequestStreamReaderFactory readerFactory)
    {
        _formatters = formatters;
        _readerFactory = readerFactory;
    }
    public IModelBinder? GetBinder(ModelBinderProviderContext context)
    {
        
        if (context == null) throw new ArgumentNullException(nameof(context));

        if (context.Metadata.ModelType.GetProperty("user_id") != null)
        {
            if (context.BindingInfo.BindingSource == BindingSource.Body)
            {
                var bodyModelBinder = new BodyModelBinder(_formatters, _readerFactory);
                return new UserIdModelBinder(bodyModelBinder);    

            }
            else
            {
                var propertiesMetadata = context.Metadata.Properties; // get all properties of the model type (DTO) 
                var propertiesBinders = propertiesMetadata.ToDictionary( // create a dictionary of propertyMetadata and its binder 
                    propertyMetadata => propertyMetadata,
                    propertyMetadata => context.CreateBinder(propertyMetadata)
                );
                var defaultBinder = new ComplexTypeModelBinder(propertiesBinders, new LoggerFactory());     // create a default binder for the model type (DTO) 
                return new UserIdModelBinder(defaultBinder);    
            }
            
        }

        return null;
    }
}